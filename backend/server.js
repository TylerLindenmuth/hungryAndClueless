const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI; // Mongo URI from .env
if(!url) {
	console.error("MONGO_URI not defined in .env");
	process.exit(1);
}

const client = new MongoClient(url);

const api = require('./api.js');
const app = express();

app.use(cors({
	origin: '*',
	methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
	allowedHeaders: ['Origin','X-Requested-With','Content-Type','Accept','Authorization']
}));

app.use(express.json());

async function start() {
	try {
		await client.connect();

		api.setApp(app, client);

		app.listen(5000, () => {
			console.log('Server running on port 5000');
		});
	} catch(e) {
		console.error("Failed to connect to MongoDB:", e);
		process.exit(1);
	}
}

start();