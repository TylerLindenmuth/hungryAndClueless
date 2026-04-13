const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI; // Mongo URI from .env
const client = new MongoClient(url);

const api = require('./api.js');

const app = express();
app.use(cors());
app.use(express.json());

async function start() {
    await client.connect();

	api.setApp(app, client);

	app.listen(5000, () => {
		console.log('Server running on port 5000');
	});
}

start();