require('express');
require('mongodb');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.setApp = function ( app, client )
{
    app.post('/api/register', async (req, res) => {

        const { name, email, password } = req.body;

		if(!name || !email || !password) {
			return res.status(400).json({accessToken: '', error: 'Missing fields'});
		}

		let error = '';

		try {
			const db = client.db('MernProject');

			// Check if user exists
			const existingUser = await db.collection('users').findOne({ email: email });

			if (existingUser) {
				return res.status(409).json({ accessToken: '', error: 'User already exists' });
			}

			// Hash password
			const bcrypt = require('bcrypt');
			const hashedpwd = await bcrypt.hash(password, 10);

			// Insert new user
			const result = await db.collection('users').insertOne({
				name: name,
				email: email,
				password: hashedpwd
			});

			const userId = result._id;

			// Create token
			const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });

			res.status(200).json({ accessToken: token, error: '' });

		} catch (e) {
			error = e.toString();
			res.status(500).json({ accessToken: '', error });
		}
	});
	
	app.post('/api/login', async (req, res) => {
        const { email, password } = req.body;

		if(!email || !password) {
			return res.status(400).json({accessToken: '', error: 'Missing fields'});
		}

		let error = '';

		try {
			const db = client.db('MernProject');

			// Hash password
			const user = await db.collection('users').findOne({ email });

            if (!user) {
                return res.status(401).json({ accessToken: '', error: 'Invalid credentials' });
            }

            const bcrypt = require('bcrypt');
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ accessToken: '', error: 'Invalid credentials' });
            }

			const token = jwt.sign(
				{ userId: user._id, email: user.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			res.status(200).json({ accessToken: token, error: '' });

		} catch (e) {
			error = e.toString();
			res.status(500).json({ accessToken: '', error });
		}
	});

    app.post('/api/addMeal', async (req, res, next) => {

        //incoming: { userId, meal, jwtToken }
        //outgoing: { error, jwtToken }

        const { userId, meal, jwtToken } = req.body;

		if(!userId || !meal || !jwtToken) {
			return res.status(400).json({accessToken: '', error: 'Missing fields'});
		}

        const newMeal = {meal:meal, userId:userId};

        let error = '';
		let decoded;

        try {
            //Decode and verify jwtToken
			decoded = jwt.verify(jwtToken, JWT_SECRET);

            if (decoded.userId.toString() !== userId) {
                return res.status(403).json({error: 'User mismatch', jwtToken: jwtToken});
            }

            //Connect to DB and insert new meal
            const db = client.db('MernProject');
            const result = await db.collection('meals').insertOne(newMeal);

            const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			res.status(200).json({ error: '', jwtToken: newToken });

        } catch(e) {
            error = e.toString();
			res.status(500).json({ error: error, jwtToken: jwtToken });
		} 
    });

    app.post('/api/deleteMeal', async (req, res, next) => {

        //incoming: { userId, mealId, jwtToken }
        //outgoing: { error, jwtToken }

        const { userId, mealId, jwtToken } = req.body;

		if(!userId || !mealId || !jwtToken) {
			return res.status(400).json({accessToken: '', error: 'Missing fields'});
		}

        let error = '';
		let decoded;

        try {
            //Decode and verify jwtToken
			decoded = jwt.verify(jwtToken, JWT_SECRET);

            if (decoded.userId !== userId) {
                return res.status(403).json({error: 'User mismatch', jwtToken: jwtToken});
            }

            //Connect to DB and delete meal matching mealId
            const db = client.db('MernProject');

			const { ObjectId } = require('mongodb');
			const result = await db.collection('meals').deleteOne({ _id: new ObjectId(mealId) });

			const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			res.status(200).json({ error: '', jwtToken: newToken });

        } catch(e) {
            error = e.toString();
			res.status(500).json({ error: error, jwtToken: jwtToken });
        }
    });
}