require('express');
require('mongodb');

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

exports.setApp = function ( app, client )
{
    app.post('/api/register', async (req, res) => {
		const { name, email, password } = req.body;

		let error = "";

		try {
			const db = client.db("MernProject");

			// Check if user exists
			const existingUser = await db.collection('users').findOne({ email: email });

			if (existingUser) {
				return res.status(200).json({ accessToken: "", error: "User already exists" });
			}

			// Insert new user
			const result = await db.collection('users').insertOne({
				name: name,
				email: email,
				password: password
			});

			const userId = result._id;

			// Create token
			const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });

			res.status(200).json({ accessToken: token, error: "" });

		} catch (e) {
			error = e.toString();
			res.status(500).json({ accessToken: "", error });
		}
	});
	
	app.post('/api/login', async (req, res) => {
		const { email, password } = req.body;

		let error = "";

		try {
			const db = client.db("MernProject");

			const user = await db.collection('users').findOne({
				email: email,
				password: password
			});

			if (!user) {
				return res.status(200).json({ accessToken: "", error: "Invalid credentials" });
			}

			const token = jwt.sign(
				{ userId: user._id, email: user.email },
				JWT_SECRET,
				{ expiresIn: "1h" }
			);

			res.status(200).json({ accessToken: token, error: "" });

		} catch (e) {
			error = e.toString();
			res.status(500).json({ accessToken: "", error });
		}
	});

    app.post('/api/addMeal', async (req, res, next) => {

        //incoming: { userId, meal, jwtToken }
        //outgoing: { error, jwtToken }

        const { userId, meal, jwtToken } = req.body;

        const newMeal = {meal:meal, userId:userId};
        let error = "";

		let decoded;
        try {
            //Decode and verify jwtToken
			decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

            if (decoded.userId !== userId) {
                return res.status(200).json({error: "User mismatch", jwtToken: jwtToken});
            }

            //Connect to DB and insert new meal
            const db = client.db("MernProject");
            const result = db.collection('meals').insertOne(newMeal);
        } catch(e) {
            error = e.toString();
        }

        var ret = {error: error, jwtToken: jwtToken};
        res.status(200).json(ret);
    });

    app.post('/api/deleteMeal', async (req, res, next) => {

        //incoming: { userId, mealId, jwtToken }
        //outgoing: { error, jwtToken }

        const { userId, mealId, jwtToken } = req.body;

        let error = "";

		let decoded;
        try {
            //Decode and verify jwtToken
			decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

            if (decoded.userId !== userId) {
                return res.status(200).json({error: "User mismatch", jwtToken: jwtToken});
            }

            //Connect to DB and delete meal matching mealId
            const db = client.db("MernProject");
            const result = db.collection('meals').deleteOne(mealId);
        } catch(e) {
            error = e.toString();
        }

        var ret = {error: error, jwtToken: jwtToken};
        res.status(200).json(ret);
    });
}