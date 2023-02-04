import mongoose from "mongoose";
import PlacementLocation from "../models/placement-locations.js";
import Hospital from "../models/hospitals.js";
import Instructor from "../models/instructors.js";

export const getPlacementLocations = async (req, res) => {
    try {
        const { index, limit } = req.query;

        const locations = await PlacementLocation.find({})
            .sort({ createdAt: -1 })
            // .limit(limit)
            // .skip(index)
            .populate("hospital")
            .populate("instructor");

        const totalCount = await PlacementLocation.find({}).count();

        res.status(200).json({
            data: locations,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getPlacementLocation = async (req, res) => {
    try {
        const { id } = req.params;

        const location = await PlacementLocation.findById(id)
            .populate("hospital")
            .populate("instructor");

        res.status(200).json(location);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const addPlacementLocation = async (req, res) => {
    try {
        const params = req.body;
        const location = new PlacementLocation(params);
        await location.save();
        await PlacementLocation.populate(location, { path: "hospital" });
        await PlacementLocation.populate(location, { path: "instructor" });
        res.status(201).json(location);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const importPlacementlocation = async (req, res) => {
    try {
        const failed = [];
        let locations = await Promise.all((req.body || []).map(async (location) => {
            try {
                const hospital = await Hospital.findOne({ campus: location.campus });

                const instuctorName = location.instructor.split(" ");
                const instructor = await Instructor.findOne({
                    fname: instuctorName[0],
                    lname: instuctorName[1]
                });

                return {
                    ...location,
                    hospital: hospital._id,
                    instructor: instructor._id
                };
            } catch (err) {
                failed.push({
                    data: location,
                    err: err.message
                });
                return null;
            }
        }));

        locations = locations.filter((location) => !!location);
        await PlacementLocation.insertMany(locations);
        res.json({ message: " Uploaded successfully.", failed });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updatePlacementLocation = async (req, res) => {
    try {
        const { body, params } = req;

        if (!mongoose.Types.ObjectId.isValid(params.id)) return res.status(404).json({ message: `No entry found with id: ${params.id}` });

        const location = await PlacementLocation.findByIdAndUpdate(params.id, body, { new: true });
        await PlacementLocation.populate(location, { path: "hospital" });
        await PlacementLocation.populate(location, { path: "instructor" });
        res.status(200).json(location);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deletePlacementLocation = async (req, res) => {
    try {
        const { id } = req.params;
        await PlacementLocation.findByIdAndDelete(id);
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deletePlacementLocations = async (req, res) => {
    const { body } = req;
    try {
        await PlacementLocation.deleteMany({ _id: { $in: body } });
        res.json({ message: "Placement locations deleted successfully." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
