require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

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
			const hashedpwd = await bcrypt.hash(password, 10);

			// Insert new user
			const result = await db.collection('users').insertOne({
				name: name,
				email: email,
				password: hashedpwd
			});

			const userId = result._id.toString();

			// Create token
			const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1h' });

			return res.status(200).json({ accessToken: token, error: '' });

		} catch (e) {
			error = e.toString();
			return res.status(500).json({ accessToken: '', error });
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

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ accessToken: '', error: 'Invalid credentials' });
            }

			const token = jwt.sign(
				{ userId: user._id.toString(), email: user.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ accessToken: token, error: '' });

		} catch (e) {
			error = e.toString();
			return res.status(500).json({ accessToken: '', error });
		}
	});

    app.post('/api/addMeal', async (req, res) => {

        //incoming: { userId, meal, accessToken }
        //outgoing: { error, accessToken }

        const { userId, meal, accessToken } = req.body;

		if(!userId || !meal || !accessToken) {
			return res.status(400).json({error: 'Missing fields', accessToken: ''});
		}

        const newMeal = {
            meal: meal,
            userId: new ObjectId(userId)
        };

        let error = '';
		let decoded;

        try {
            //Decode and verify token
			decoded = jwt.verify(accessToken, JWT_SECRET);
        } catch(e) {
            return res.status(401).json({ error: 'Invalid or expired token', accessToken: ''})
        }

        try {
            if (decoded.userId !== userId) {
                return res.status(403).json({error: 'User mismatch', accessToken: ''});
            }

            //Connect to DB and insert new meal
            const db = client.db('MernProject');
            const result = await db.collection('meals').insertOne(newMeal);

            const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ error: '', accessToken: newToken });

        } catch(e) {
            error = e.toString();
			return res.status(500).json({ error: error, accessToken: ''});
		} 
    });

    app.post('/api/deleteMeal', async (req, res) => {

        //incoming: { userId, mealId, accessToken }
        //outgoing: { error, accessToken }

        const { userId, mealId, accessToken } = req.body;

		if(!userId || !mealId || !accessToken) {
			return res.status(400).json({error: 'Missing fields', accessToken: ''});
		}

        //Ensure that mealId is a valid object identifier
        if (!ObjectId.isValid(mealId)) {
            return res.status(400).json({error: 'Invalid mealId', accessToken: ''});
        }

        let error = '';
		let decoded;

        try {
            //Decode and verify token
			decoded = jwt.verify(accessToken, JWT_SECRET);
        } catch(e) {
            return res.status(401).json({ error: 'Invalid or expired token', accessToken: ''})
        }

        try {
            if (decoded.userId !== userId) {
                return res.status(403).json({error: 'User mismatch', accessToken: ''});
            }

            //Connect to DB and delete meal matching mealId
            const db = client.db('MernProject');

			const result = await db.collection('meals').deleteOne({
                _id: new ObjectId(mealId),
                userId: new ObjectId(decoded.userId)
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Meal not found', accessToken: '' });
            }

			const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ error: '', accessToken: newToken });

        } catch(e) {
            error = e.toString();
			return res.status(500).json({ error: error, accessToken: ''});
        }
    });
}