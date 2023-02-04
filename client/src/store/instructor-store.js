import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

class InstructorStore {
    list = [];

    totalCount = 0;

    fetched = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAll() {
        const response = await axios.get("/instructors");
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

        const response = await axios.get(`/instructors/${id}`);
        return response.data;
    }

    async addNew(params) {
        const res = await axios.post("/instructors", params);
        runInAction(() => {
            this.list.unshift(res.data);
            this.totalCount += 1;
        });
    }

    async edit(id, params) {
        const res = await axios.patch(`/instructors/${id}`, params);
        runInAction(() => {
            const index = this.list.findIndex((obj) => obj._id === id);
            this.list[index] = res.data;
        });
    }

    async delete(index) {
        const toDeleteId = this.list[index]._id;
        await axios.delete(`/instructors/${toDeleteId}`);
        runInAction(() => {
            this.list.splice(index, 1);
            this.totalCount -= 1;
        });
    }

    async deleteMultiple(indexes) {
        const toDeleteIds = indexes.map((index) => this.list[Number(index)]._id);
        await axios.post("/instructors/delete", toDeleteIds);
        await this.fetchAll();
    }

    async import(data) {
        await axios.post("/instructors/import", data);
        await this.fetchAll();
    }
}

export default InstructorStore;
