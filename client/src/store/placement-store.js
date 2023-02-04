import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { getStatusText, toDefaultDateFormat } from "../components/utils";

export default class PlacementStore {
    list = [];

    totalCount = 0;

    fetched = false;

    constructor() {
        makeAutoObservable(this);
    }

    // eslint-disable-next-line class-methods-use-this
    populateData(obj) {
        return {
            ...obj,
            totalStudents: obj.students.length,
            totalLocations: obj.placementLocations.length,
            totalSeats: obj.placementLocations.reduce((count, location) => count += Number(location.seats), 0),
            statusText: getStatusText(obj.status, {
                variant: "subtitle2"
            }),
            lastUpdatedAt: toDefaultDateFormat(new Date(obj.updatedAt))
        };
    }

    populateDataList(data) {
        return data.map((obj) => this.populateData({
            ...obj,
            haveToFetchDetails: true
        }));
    }

    async fetchAll() {
        const response = await axios.get("/placements");
        const { data, totalCount } = response.data;
        runInAction(() => {
            this.list = this.populateDataList(data);
            this.totalCount = totalCount;
            this.fetched = true;
        });
    }

    async get(id) {
        const dataIndex = this.list.findIndex((obj) => obj._id === id);
        if (dataIndex > -1 && !this.list[dataIndex].haveToFetchDetails) {
            return this.list[dataIndex];
        }

        const response = await axios.get(`/placements/${id}`);
        this.list[dataIndex] = this.populateData({
            ...response.data,
            haveToFetchDetails: false
        });
        return this.list[dataIndex];
    }

    async createPlacement(params) {
        const response = await axios.post("/placements", params);
        const placementId = response.data._id;

        runInAction(() => {
            this.list = [];
            this.totalCount = 0;
            this.fetched = false;
        });

        return placementId;
    }

    async update(id, params) {
        const res = await axios.patch(`/placements/${id}`, params);
        runInAction(() => {
            const index = this.list.findIndex((obj) => obj._id === id);
            this.list[index] = this.populateData({ ...res.data, haveToFetchDetails: false });
        });
    }

    async delete(index) {
        const toDeleteId = this.list[index]._id;
        await axios.delete(`/placements/${toDeleteId}`);
        runInAction(() => {
            this.list.splice(index, 1);
            this.totalCount -= 1;
        });
    }

    async confirmPlacement(id) {
        await axios.patch(`/placements/${id}/confirm`);
        runInAction(() => {
            const index = this.list.findIndex((obj) => obj._id === id);
            this.list[index].status = "confirmed";
        });
    }
}
