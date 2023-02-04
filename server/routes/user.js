import express from "express";
import {
    registerUser, loginUser, checkIfTokenIsValid, getUser
} from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getUser);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/isValidToken", checkIfTokenIsValid);

export default router;
