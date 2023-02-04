import mongoose from "mongoose";

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017");
    } catch (err) {
        throw new Error(`Error while connecting to db - ${err}`);
    }
}
