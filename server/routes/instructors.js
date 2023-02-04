import express from "express";
import {
    addInstructor, deleteInstructor, deleteInstructors,
    getInstructor, getInstructors, updateInstructor, importInstructor
} from "../controllers/instructors.js";

const router = express.Router();

router.get("/", getInstructors);

router.get("/:id", getInstructor);

router.post("/", addInstructor);

router.post("/import", importInstructor);

router.patch("/:id", updateInstructor);

router.delete("/:id", deleteInstructor); // For single deletion

router.post("/delete", deleteInstructors); // For multiple deletion

export default router;
