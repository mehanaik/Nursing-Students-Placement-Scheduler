import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    comments: { type: String, trim: true }
}, { timestamps: true });

const Instructor = mongoose.model("Instructor", InstructorSchema);

export default Instructor;
