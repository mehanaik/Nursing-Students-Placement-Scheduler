import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

export default class SchoolStore {
    list = [];

    totalCount = 0;

    fetched = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAll() {
        const response = await axios.get("/schools");
        const { data, totalCount } = response.data;
        runInAction(() => {
            this.list = data;
            this.totalCount = totalCount;
            this.fetched = true;
        });
    }

    async get(id) {
        if (this.fetched) {
            return this.list.find((obj) => obj._id === id);
        }

        const response = await axios.get(`/schools/${id}`);
        return response.data;
    }

    async addNew(params) {
        const response = await axios.post("/schools", params);
        runInAction(() => {
            this.list.unshift(response.data);
            this.totalCount += 1;
        });
    }

    async edit(id, params) {
        const response = await axios.patch(`/schools/${id}`, params);
        runInAction(() => {
            const index = this.list.findIndex((obj) => obj._id === id);
            this.list[index] = response.data;
        });
    }

    async delete(index) {
        const toDeleteId = this.list[index]._id;
        await axios.delete(`/schools/${toDeleteId}`);
        runInAction(() => {
            this.list.splice(index, 1);
            this.totalCount -= 1;
        });
    }

    async deleteMultiple(indexes) {
        const toDeleteIds = indexes.map((index) => this.list[Number(index)]._id);
        await axios.post("/schools/delete", toDeleteIds);
        await this.fetchAll();
    }

    async import(data) {
        await axios.post("/schools/import", data);
        await this.fetchAll();
    }
}
