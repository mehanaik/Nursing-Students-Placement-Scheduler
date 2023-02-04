import mongoose from "mongoose";
import PlacementLocation from "../models/placement-locations.js";
import Placement from "../models/placements.js";
import Student from "../models/students.js";

export const getPlacements = async (req, res) => {
    try {
        // const { index, limit } = req.query;

        const placements = await Placement.find({})
            .sort({ createdAt: -1 })
            .populate("placementLocations");
            // .limit(limit)
            // .skip(index)

        const totalCount = await Placement.find({}).count();

        res.status(200).json({
            data: placements,
            totalCount
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getPopulatedPlacementModel = async (id) => {
    const placement = await Placement.findById(id)
        .populate({
            path: "students",
            select: "studentId fname lname"
        })
        .populate({
            path: "placementLocations",
            populate: [{ path: "hospital" }, { path: "instructor" }]
        }).exec();
    return placement;
};

export const getPlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const placement = await getPopulatedPlacementModel(id);
        res.status(200).json(placement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const createPlacement = async (req, res) => {
    try {
        const {
            term, year, locations, name
        } = req.body;

        const students = await Student.find({ term, year }).sort({ fname: -1 });

        const studentIds = students.map((student) => student._id);

        const placementLocations = await PlacementLocation.find({
            _id: { $in: locations }
        });

        if (placementLocations.length !== locations.length) {
            throw new Error("Invalid placement location id");
        }

        const placementLocationAvailableSeatsMap = placementLocations.reduce((result, location) => {
            result[location._id] = location.seats;
            return result;
        }, {});

        // Perform placement for each student
        const placements = students.map((student) => {
            const prevPlacements = student.placementLocations || [];
            // filter available locations for current student
            const availableLocations = placementLocations.filter((location) =>
                prevPlacements.indexOf(location._id) === -1);

            // If no locations available to place student, return null for placementLocation
            // This needs to be fixed by the user in UI
            if (!availableLocations.length) {
                return {
                    studentId: student._id,
                    placementLocationId: null
                };
            }

            // Loop - Take a random location and assign the student if seat is available
            // If not, try getting another location
            const triedIndexSet = new Set();
            const availableLocationsLength = availableLocations.length;
            let randomIndex = -1;
            while (true) {
                randomIndex = Math.floor(Math.random() * availableLocationsLength);
                triedIndexSet.add(randomIndex);
                // If seat available, break the loop
                if ((placementLocationAvailableSeatsMap[availableLocations[randomIndex]._id] > 0)) {
                    break;
                }

                // If cannot find a seat after trying all the possibilities, break the loop
                if (triedIndexSet.size === availableLocationsLength) {
                    randomIndex = -1;
                    break;
                }
            }

            if (randomIndex > -1) {
                const assignedLocation = availableLocations[randomIndex]._id;
                placementLocationAvailableSeatsMap[assignedLocation] -= 1;
                return {
                    studentId: student._id,
                    placementLocationId: assignedLocation
                };
            }
            return {
                studentId: student._id,
                placementLocationId: null
            };
        }, {});

        const placement = await Placement.create({
            name, year, term, students: studentIds, placementLocations: locations, placements
        });
        res.status(201).json(placement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updatePlacement = async (req, res) => {
    try {
        const { body, params } = req;

        if (!mongoose.Types.ObjectId.isValid(params.id)) return res.status(404).json({ message: `No entry found with id: ${params.id}` });

        const placement = await Placement.findById(params.id);
        if (placement.status === "confirmed") {
            throw new Error("Cannot modify a confirmed placement");
        }

        const toUpdateArr = body.placements;
        await Promise.all(toUpdateArr.map(async (placementInfo) => {
            await Placement.updateOne(
                { "placements.studentId": placementInfo.studentId },
                {
                    $set: {
                        "placements.$.placementLocationId": placementInfo.placementLocationId || null,
                        "placements.$.notes": placementInfo.notes
                    }
                }
            );

            return "";
        }));

        const placementModel = await getPopulatedPlacementModel(params.id);
        res.status(200).json(placementModel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deletePlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const placement = await Placement.findById(id);
        if (placement.status === "confirmed") {
            throw new Error("Cannot delete a confirmed placement");
        }
        await Placement.findByIdAndDelete(id);
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const confirmPlacement = async (req, res) => {
    try {
        const { id } = req.params;
        const placement = await Placement.findById(id);

        if (placement.status === "confirmed") {
            throw new Error("Placement already confirmed");
        }

        const { placements, students } = placement;

        if (students.length !== placements.length) {
            throw new Error("Students and placements count mismatch");
        }

        // Check if all students are assigned the placement location
        const isAllStudentsAssigned = placements.every((obj) => obj.placementLocationId);

        if (!isAllStudentsAssigned) {
            throw new Error("Some students are not assigned with the placement location. Please assign the location for all students and try again.");
        }

        // Add placement and placement location to each student
        await Promise.all(placements.map(async ({ studentId, placementLocationId }) => {
            const student = await Student.findById(studentId);
            if (student) {
                student.placementLocationsHistory.push(placementLocationId);
                student.placementsHistory.push(id);
                await student.save();
            }
        }));

        // Mark the placement as confirmed
        placement.status = "confirmed";
        await placement.save();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
