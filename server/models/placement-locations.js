import mongoose from "mongoose";

const { Schema } = mongoose;

const PlacementLocationSchema = new Schema({
    name: { type: String, required: true, trim: true },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
    unit: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
    shift: { type: String, required: true, default: "" },
    seats: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const PlacementLocation = mongoose.model("PlacementLocation", PlacementLocationSchema);

export default PlacementLocation;
