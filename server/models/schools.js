import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    campus: { type: String, required: true }
}, { timestamps: true });

const School = mongoose.model("School", SchoolSchema);

export default School;
