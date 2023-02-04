import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    campus: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true }
}, { timestamps: true });

const Hospital = mongoose.model("Hospital", HospitalSchema);

export default Hospital;
