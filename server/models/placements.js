import mongoose from "mongoose";

const { Schema } = mongoose;

const PlacementSchema = new Schema({
    name: { type: String, required: true, trim: true },
    term: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    placementLocations: [{ type: Schema.Types.ObjectId, ref: "PlacementLocation" }],
    placements: [{
        studentId: { type: Schema.Types.ObjectId, ref: "Student" },
        placementLocationId: {
            type: Schema.Types.ObjectId, ref: "PlacementLocation", required: false, default: null
        },
        notes: { type: String, default: "" }
    }],
    status: { type: String, required: true, default: "created" }
}, { timestamps: true });

const Placement = mongoose.model("Placement", PlacementSchema);

export default Placement;
