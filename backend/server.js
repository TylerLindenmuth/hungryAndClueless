require('dotenv').config();
const { MongoClient } = require("mongodb");
const express = require('express');
const cors = require('cors');

const url = process.env.MONGO_URI; // Mongo URI from .env
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/ping", (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
