import mongoose from "mongoose";
import School from "../models/schools.js";

export const getSchools = async (req, res) => {
    try {
        const { index, limit } = req.query;

        const schools = await School.find({})
            .sort({ createdAt: -1 });
            // .limit(limit)
            // .skip(index);

        const totalCount = await School.find({}).count();

        res.status(200).json({
            data: schools,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getSchool = async (req, res) => {
    try {
        const { id } = req.params;
        const school = await School.findById(id);
        res.status(200).json(school);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addSchool = async (req, res) => {
    try {
        const { name, campus } = req.body;
        const school = new School({
            name, campus
        });
        await school.save();
        res.status(201).json(school);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const importSchool = async (req, res) => {
    try {
        const { body } = req;
        await School.insertMany(body);
        res.json({ message: " Uploaded successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateSchool = async (req, res) => {
    try {
        const { body, params } = req;

        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            return res.status(404).json({ message: `No entry found with id: ${params.id}` });
        }

        const school = await School.findByIdAndUpdate(params.id, body, { new: true });
        res.status(200).json(school);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;
        await School.findByIdAndDelete(id);
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteSchools = async (req, res) => {
    const { body } = req;
    try {
        await School.deleteMany({ _id: { $in: body } });
        res.json({ message: "Schools deleted successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
