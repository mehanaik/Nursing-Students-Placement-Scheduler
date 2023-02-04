import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/users.js";

export const isCurrentUserAdmin = async (userId) => {
    const user = await User.findById(userId);
    return user && user.isAdmin;
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        return res.json({
            id: user._id,
            displayName: user.displayName,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        let { displayName } = req.body;

        if (!displayName) displayName = username;

        if (!displayName || !username || !password || !confirmPassword) {
            return res.status(400)
                .json({ message: "All fields are mandatory" });
        }

        if (password.length < 5) {
            return res.status(400)
                .json({ message: "Password should be least 5 characters" });
        }

        if (password !== confirmPassword) {
            return res.status(400)
                .json({ message: "Confirm password does not match with password" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Username already exists." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const user = new User({
            username,
            password: passwordHash,
            displayName
        });
        await user.save();
        res.json({ message: "Successfully registered" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Email or password is missing" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ message: "No account found for this username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const checkIfTokenIsValid = async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
