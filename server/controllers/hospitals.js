import mongoose from "mongoose";
import Hospital from "../models/hospitals.js";

export const getHospitals = async (req, res) => {
    try {
        const { index, limit } = req.query;

        const hospitals = await Hospital.find({})
            .sort({ createdAt: -1 });
            // .limit(limit)
            // .skip(index);

        const totalCount = await Hospital.find({}).count();

        res.status(200).json({
            data: hospitals,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await Hospital.findById(id);
        res.status(200).json(hospital);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addHospital = async (req, res) => {
    try {
        const { name, address, campus } = req.body;
        const hospital = new Hospital({
            name, address, campus
        });
        await hospital.save();
        res.status(201).json(hospital);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const importHospital = async (req, res) => {
    try {
        const { body } = req;
        await Hospital.insertMany(body);
        res.json({ message: " Uploaded successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateHospital = async (req, res) => {
    try {
        const { body, params } = req;

        if (!mongoose.Types.ObjectId.isValid(params.id)) return res.status(404).json({ message: `No entry found with id: ${params.id}` });

        const hospital = await Hospital.findByIdAndUpdate(params.id, body, { new: true });
        res.status(200).json(hospital);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const deleteHospital = async (req, res) => {
    try {
        const { id } = req.params;
        await Hospital.findByIdAndDelete(id);
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteHospitals = async (req, res) => {
    const { body } = req;
    try {
        await Hospital.deleteMany({ _id: { $in: body } });
        res.json({ message: "Hospitals deleted successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
