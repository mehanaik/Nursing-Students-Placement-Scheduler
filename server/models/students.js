import mongoose from "mongoose";

const { Schema } = mongoose;

const StudentsSchema = new Schema({
    studentId: { type: Number, required: true },
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    // phoneNumber: { type: Number, required: true },
    // school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    year: { type: Number, required: true },
    term: { type: String, required: true },
    notes: { type: String, default: "" },
    placementLocationsHistory: [{ type: Schema.Types.ObjectId, ref: "PlacementLocation" }],
    placementsHistory: [{ type: Schema.Types.ObjectId, ref: "Placement" }]
}, { timestamps: true });

const Student = mongoose.model("Student", StudentsSchema);

export default Student;
