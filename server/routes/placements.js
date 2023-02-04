import express from "express";
import {
    confirmPlacement,
    createPlacement, deletePlacement, getPlacement, getPlacements, updatePlacement
} from "../controllers/placements.js";

const router = express.Router();

router.get("/", getPlacements);

router.get("/:id", getPlacement);

router.post("/", createPlacement);

router.patch("/:id", updatePlacement);

router.delete("/:id", deletePlacement); // For single deletion

router.patch("/:id/confirm", confirmPlacement);

export default router;
