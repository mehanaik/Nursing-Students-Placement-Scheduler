import express from "express";
import {
    addStudent, deleteStudent, deleteStudents, importStudents,
    getStudent,
    getStudents, updateStudent, getStudentPlacements
} from "../controllers/students.js";

const router = express.Router();

router.get("/", getStudents);

router.get("/:id", getStudent);

router.get("/:id/placements", getStudentPlacements);

router.post("/", addStudent);

router.post("/import", importStudents);

router.patch("/:id", updateStudent);

router.delete("/:id", deleteStudent); // For single deletion

router.post("/delete", deleteStudents); // For multiple deletion

export default router;
