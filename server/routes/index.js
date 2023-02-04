import express from "express";
import auth from "../middleware/auth.js";

import UserRoutes from "./user.js";
import HospitalRoutes from "./hospitals.js";
import SchoolsRoutes from "./schools.js";
import InstructorRoutes from "./instructors.js";
import LocationRoutes from "./placement-locations.js";
import StudentRoutes from "./students.js";
import PlacementRoutes from "./placements.js";

const router = express.Router();

router.use("/user", UserRoutes);

router.use("/hospitals", auth, HospitalRoutes);

router.use("/schools", auth, SchoolsRoutes);

router.use("/instructors", auth, InstructorRoutes);

router.use("/locations", auth, LocationRoutes);

router.use("/students", auth, StudentRoutes);

router.use("/students", auth, StudentRoutes);

router.use("/placements", auth, PlacementRoutes);

export default router;
