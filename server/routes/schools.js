import express from "express";
import {
    addSchool, deleteSchool, deleteSchools, getSchool, getSchools, updateSchool, importSchool
} from "../controllers/schools.js";

const router = express.Router();

router.get("/", getSchools);

router.get("/:id", getSchool);

router.post("/", addSchool);

router.post("/import", importSchool);

router.patch("/:id", updateSchool);

router.delete("/:id", deleteSchool); // For single deletion

router.post("/delete", deleteSchools); // For multiple deletion

export default router;
