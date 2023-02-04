import mongoose from "mongoose";
import Instructor from "../models/instructors.js";

export const getInstructors = async (req, res) => {
    try {
        const { index, limit } = req.query;

        const instructors = await Instructor.find({})
            .sort({ createdAt: -1 });
            // .limit(limit)
            // .skip(index);

        const totalCount = await Instructor.find({}).count();

        res.status(200).json({
            data: instructors,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await Instructor.findById(id);
        res.status(200).json(hospital);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addInstructor = async (req, res) => {
    try {
        const params = req.body;

        const instructor = new Instructor(params);
        await instructor.save();
        res.status(201).json(instructor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const importInstructor = async (req, res) => {
    try {
        const { body } = req;
        await Instructor.insertMany(body);
        res.json({ message: " Uploaded successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateInstructor = async (req, res) => {
    try {
        const { body, params } = req;

        if (!mongoose.Types.ObjectId.isValid(params.id)) return res.status(404).json({ message: `No entry found with id: ${params.id}` });

        const instructor = await Instructor.findByIdAndUpdate(params.id, body, { new: true });
        res.status(200).json(instructor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        await Instructor.findByIdAndDelete(id);
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteInstructors = async (req, res) => {
    const { body } = req;
    try {
        await Instructor.deleteMany({ _id: { $in: body } });
        res.json({ message: "Instructors deleted successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
