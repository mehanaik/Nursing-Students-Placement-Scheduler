import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";

class PlacementLocationStore {
    list = [];

    totalCount = 0;

    fetched = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAll() {
        const res = await axios.get("/locations");
        const { data, totalCount } = res.data;
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

        const res = await axios.get(`/locations/${id}`);
        return res.data;
    }

    async addNew(params) {
        const res = await axios.post("/locations", params);
        runInAction(() => {
            this.list.unshift(res.data);
            this.totalCount += 1;
        });
    }

    async edit(id, params) {
        const res = await axios.patch(`/locations/${id}`, params, "PATCH");
        const index = this.list.findIndex((obj) => obj._id === id);
        if (index > -1) {
            runInAction(() => {
                this.list[index] = res.data;
            });
        }
    }

    async delete(index) {
        const toDeleteId = this.list[index]._id;
        await axios.delete(`/locations/${toDeleteId}`);
        runInAction(() => {
            this.list.splice(index, 1);
            this.totalCount -= 1;
        });
    }

    async deleteMultiple(indexes) {
        const toDeleteIds = indexes.map((index) => this.list[Number(index)]._id);
        await axios.post("/locations/delete", toDeleteIds);
        await this.fetchAll();
    }

    async import(data) {
        await axios.post("/locations/import", data);
        await this.fetchAll();
    }
}

export default PlacementLocationStore;
