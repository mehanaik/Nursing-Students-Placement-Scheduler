import express from "express";
import {
    addHospital, deleteHospital, deleteHospitals, getHospitals,
    importHospital, updateHospital, getHospital
} from "../controllers/hospitals.js";

const router = express.Router();

router.get("/", getHospitals);

router.get("/:id", getHospital);

router.post("/", addHospital);

router.post("/import", importHospital);

router.patch("/:id", updateHospital);

router.delete("/:id", deleteHospital); // For single delete

router.post("/delete", deleteHospitals); // For multiple delete

export default router;
