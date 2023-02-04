/* eslint-disable max-len */
import express from "express";
import {
    addPlacementLocation, deletePlacementLocation, deletePlacementLocations, importPlacementlocation,
    getPlacementLocation,
    getPlacementLocations, updatePlacementLocation
} from "../controllers/placement-locations.js";

const router = express.Router();

router.get("/", getPlacementLocations);

router.get("/:id", getPlacementLocation);

router.post("/", addPlacementLocation);

router.post("/import", importPlacementlocation);

router.patch("/:id", updatePlacementLocation);

router.delete("/:id", deletePlacementLocation); // For single deletion

router.post("/delete", deletePlacementLocations); // For multiple deletion

export default router;
