import express from "express";
import cors from "cors";
import passport from "passport";
import mongodb from "mongodb";
import dotenv from "dotenv";
import router from "./routes/api/user.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3001', // or 3000 or wherever your frontend runs
    credentials: true
  }));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/users", router);

import configurePassport from "./config/passport.js";

configurePassport(passport);

// Handle 404 for all other routes
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

// Database connection and server start
mongoose.connect(
    process.env.ABSOLUTE_PITCH_DB_URI,
    {
        ssl: true,
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    }
)
    .then(client => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection failed:", err);
    });