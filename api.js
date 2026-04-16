require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

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

			// Generate 6-digit email verification code
			const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

			// Insert new user
			const result = await db.collection('users').insertOne({
				name: name,
				email: email,
				password: hashedpwd,
				verifyCode: verifyCode,
				verified: false
			});

			
			await transporter.sendMail({
				from: `"Meal App" <${process.env.EMAIL_USER}>`,
				to: email,
				subject: 'Verify your email',
				text: `Your verification code is: ${verifyCode}`
			});

			const userId = result.insertedId.toString();

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

    app.post('/api/addmeal', async (req, res) => {

        //incoming: { userId, meal, jwtToken }
        //outgoing: { mealId, error, jwtToken }

        const { userId, meal, jwtToken } = req.body;

		if(!userId || (meal == null) || !jwtToken) {
			return res.status(400).json({ mealId: null, error: 'Missing fields', jwtToken: '' });
		}

		if (!ObjectId.isValid(userId)) {
			return res.status(400).json({ mealId: null, error: 'Invalid userId', jwtToken: '' });
		}

        const newMeal = {
            ...meal,
            userId: new ObjectId(userId)
        };

        let error = '';
		let decoded;

        try {
            //Decode and verify token
			decoded = jwt.verify(jwtToken, JWT_SECRET);
        } catch {
            return res.status(401).json({ mealId: null, error: 'Invalid or expired token', jwtToken: ''});
        }

        try {
            if (decoded.userId !== userId) {
                return res.status(403).json({mealId: null, error: 'User mismatch', jwtToken: ''});
            }

            //Connect to DB and insert new meal
            const db = client.db('MernProject');
            const result = await db.collection('meals').insertOne(newMeal);

            const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ mealId: result.insertedId, error: '', jwtToken: newToken });

        } catch(e) {
            error = e.toString();
			return res.status(500).json({ mealId: null, error: error, jwtToken: ''});
		} 
    });

    app.post('/api/deletemeal', async (req, res) => {

        //incoming: { userId, mealId, jwtToken }
        //outgoing: { error, jwtToken }

        const { userId, mealId, jwtToken } = req.body;

		if(!userId || !mealId || !jwtToken) {
			return res.status(400).json({ error: 'Missing fields', jwtToken: '' });
		}

		if (!ObjectId.isValid(userId)) {
			return res.status(400).json({ error: 'Invalid userId', jwtToken: '' });
		}

        //Ensure that mealId is a valid object identifier
        if (!ObjectId.isValid(mealId)) {
            return res.status(400).json({error: 'Invalid mealId', jwtToken: ''});
        }

        let error = '';
		let decoded;

        try {
            //Decode and verify token
			decoded = jwt.verify(jwtToken, JWT_SECRET);
        } catch {
            return res.status(401).json({ error: 'Invalid or expired token', jwtToken: ''});
        }

        try {
            if (decoded.userId !== userId) {
                return res.status(403).json({error: 'User mismatch', jwtToken: ''});
            }

            //Connect to DB and delete meal matching mealId
            const db = client.db('MernProject');

			const result = await db.collection('meals').deleteOne({
                _id: new ObjectId(mealId),
                userId: new ObjectId(decoded.userId)
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Meal not found', jwtToken: '' });
            }

			const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ error: '', jwtToken: newToken });

        } catch(e) {
            error = e.toString();
			return res.status(500).json({ error: error, jwtToken: ''});
        }
    });

	app.post('/api/addmeals', async (req, res) => {

		//incoming: { userId, meals[], jwtToken }
		//returns: { error, jwtToken }

		const { userId, meals, jwtToken } = req.body;

		if(!userId || !jwtToken) {
			return res.status(400).json({ error: 'Missing fields', jwtToken: '' });
		}

		if (!meals.every(meal => typeof meal === 'object' && meal !== null)) {
			return res.status(400).json({ error: 'Invalid meal array format', jwtToken: '' });
		}

		if (!ObjectId.isValid(userId)) {
			return res.status(400).json({ error: 'Invalid userId', jwtToken: '' });
		}

		let error = '';
		let decoded;

		try {
			//Decode and verify token
			decoded = jwt.verify(jwtToken, JWT_SECRET);
		} catch {
			return res.status(401).json({ error: 'Invalid or expired token', jwtToken: ''});
		}

		try {
			if (decoded.userId !== userId) {
				return res.status(403).json({error: 'User mismatch', jwtToken: ''});
			}

			//Connect to DB
			const db = client.db('MernProject');

			const mealList = meals.map(meal => ({
				...meal,
				userId: new ObjectId(userId)
			}));
			
			const result = await db.collection('meals').insertMany(mealList, { ordered: false });

			if(result.insertedCount !== meals.length) {
				return res.status(500).json({ error: 'Error inserting meals', jwtToken: '' });
			}

			const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ error: '', jwtToken: newToken });

		} catch(e) {
			error = e.toString();
			return res.status(500).json({ error: error, jwtToken: ''});
		}
	});

	app.post('/api/getmeals', async (req, res) => {
		
		//incoming: { userId, jwtToken }
		//outgoing: { meals[], error, jwtToken }

		const { userId, jwtToken } = req.body;

		if(!userId || !jwtToken) {
			return res.status(400).json({ meals: [], error: 'Missing fields', jwtToken: '' });
		}

		if (!ObjectId.isValid(userId)) {
			return res.status(400).json({ meals: [], error: 'Invalid userId', jwtToken: '' });
		}

		let error = '';
		let decoded;

		try {
			//Decode and verify token
			decoded = jwt.verify(jwtToken, JWT_SECRET);
		} catch {
			return res.status(401).json({ meals: [], error: 'Invalid or expired token', jwtToken: ''});
		}

		try {
			if (decoded.userId !== userId) {
                return res.status(403).json({ meals: [], error: 'User mismatch', jwtToken: '' });
            }

            //Connect to DB
            const db = client.db('MernProject');

			//Collect all meals matching userId
			const mealList = await db.collection('meals').find({ userId: new ObjectId(userId) }).toArray();

			const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ meals: mealList, error: '', jwtToken: newToken });

		} catch(e) {
			error = e.toString();
			return res.status(500).json({ meals: [], error: error, jwtToken: ''});
		}
	});

	app.put('/api/editmeal', async (req, res) => {

		//incoming: { userId, meal, jwtToken }
		//outgoing: { error, jwtToken }

		const { userId, meal, jwtToken } = req.body;

		if(!userId || (meal == null) || !jwtToken) {
			return res.status(400).json({ error: 'Missing fields', jwtToken: '' });
		}

		if (!ObjectId.isValid(userId)) {
			return res.status(400).json({ error: 'Invalid userId', jwtToken: '' });
		}

        let error = '';
		let decoded;

        try {
            //Decode and verify token
			decoded = jwt.verify(jwtToken, JWT_SECRET);
        } catch {
            return res.status(401).json({ error: 'Invalid or expired token', jwtToken: ''});
        }

        try {
            if (decoded.userId !== userId) {
                return res.status(403).json({error: 'User mismatch', jwtToken: ''});
            }

            //Connect to DB
            const db = client.db('MernProject');

			const updates = { ...meal };

			if (!meal._id) {
				return res.status(400).json({ error: 'Missing mealId', jwtToken: '' });
			}

			const mealId = new ObjectId(updates._id);
			delete updates._id;
			delete updates.userId;

			const result = await db.collection('meals').updateOne(
				{ _id: mealId, userId: new ObjectId(userId) },
				{ $set: updates }
			);

			if (result.matchedCount === 0) {
				return res.status(404).json({ error: 'Meal not found', jwtToken: '' });
			}

            const newToken = jwt.sign(
				{ userId: decoded.userId, email: decoded.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ error: '', jwtToken: newToken });

        } catch(e) {
            error = e.toString();
			return res.status(500).json({ error: error, jwtToken: ''});
		}
	});

	app.post('/api/verifyemail', async (req, res) => {

		//incoming: { email, code }
		//outgoing: { accessToken, error }

		const { email, code } = req.body;

		if (!email || !code) {
			return res.status(400).json({ accessToken: '', error: 'Missing fields' });
		}

		try {
			const db = client.db('MernProject');

			const user = await db.collection('users').findOne({ email });

			if (!user) {
				return res.status(404).json({ accessToken: '', error: 'User not found' });
			}

			if (user.verified) {
				return res.status(400).json({ accessToken: '', error: 'Email already verified' });
			}

			if (user.verifyCode !== code) {
				return res.status(401).json({ accessToken: '', error: 'Invalid verification code' });
			}

			// Mark user as verified and clear the code
			await db.collection('users').updateOne(
				{ email },
				{ $set: { verified: true }, $unset: { verifyCode: '' } }
			);

			const token = jwt.sign(
				{ userId: user._id.toString(), email: user.email },
				JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return res.status(200).json({ accessToken: token, error: '' });

		} catch (e) {
			return res.status(500).json({ accessToken: '', error: e.toString() });
		}
	});

	app.post('/api/forgotpassword', async (req, res) => {

		//incoming: { email }
		//outgoing: { error }
		// Always returns success even if email not found (security best practice)

		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ error: 'Missing fields' });
		}

		try {
			const db = client.db('MernProject');

			const user = await db.collection('users').findOne({ email });

			// Return success regardless so we don't expose which emails are registered
			if (!user) {
				return res.status(200).json({ error: '' });
			}

			// Generate a reset token valid for 1 hour
			const resetToken = require('crypto').randomBytes(32).toString('hex');
			const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

			await db.collection('users').updateOne(
				{ email },
				{ $set: { resetToken, resetExpiry } }
			);

			
			const resetLink = `https://hungryandclueless.xyz/reset-password?token=${resetToken}`;

			await transporter.sendMail({
				from: `"Meal App" <${process.env.EMAIL_USER}>`,
				to: email,
				subject: 'Password Reset',
				text: `Click this link to reset your password: ${resetLink}`
			});

			return res.status(200).json({ error: '' });

		} catch (e) {
			return res.status(500).json({ error: e.toString() });
		}
	});

	app.post('/api/resetpassword', async (req, res) => {
	const { token, newPassword } = req.body;

	if (!token || !newPassword) {
		return res.status(400).json({ error: 'Missing fields' });
	}

	try {
		const db = client.db('MernProject');

		const user = await db.collection('users').findOne({
			resetToken: token,
			resetExpiry: { $gt: new Date() } // not expired
		});

		if (!user) {
			return res.status(400).json({ error: 'Invalid or expired token' });
		}

		const hashedpwd = await bcrypt.hash(newPassword, 10);

		await db.collection('users').updateOne(
			{ _id: user._id },
			{
				$set: { password: hashedpwd },
				$unset: { resetToken: '', resetExpiry: '' }
			}
		);

		return res.status(200).json({ error: '' });

	} catch (e) {
		return res.status(500).json({ error: e.toString() });
	}
});

	app.post('/api/getpackages', async (req, res) => {

        //Receives:  { jwtToken }
        //Returns:   { packages: [{ _id, name, description, meals[] }], error, jwtToken }

        const { jwtToken } = req.body;

        if(!jwtToken) {
            return res.status(400).json({ packages: [], error: 'Missing fields', jwtToken: '' });
        }

        let error = '';
        let decoded;

        try {
            //Decode and verify token
            decoded = jwt.verify(jwtToken, JWT_SECRET);
        } catch {
            return res.status(401).json({ packages: [], error: 'Invalid or expired token', jwtToken: ''});
        }

        try {
            //Connect to DB
            const db = client.db('MernProject');

            const pkgNames = ["healthyAndQuick", "comfortFood", "takeoutFavorites", "lazyMeals", "specialDiet"];
            const pkgDesc = ["Healthy and quick meals!", "Classic comfort foods", "Best food for eating in!",
								"Meals for when you don't feel like cooking", "Meals for dietary restrictions"];
            
			let pkgs = [];

            for(let i = 0; i < 5; i++){
				const search = pkgNames[i].toString();
                let meals = await db.collection('meals').find({ package: search }).toArray();

                if(meals.length > 0){
                	let curPkg = {_id: (i.toString()), name: pkgNames[i], description: pkgDesc[i], meals: meals};
                    pkgs.push(curPkg);
                }
            }

            const newToken = jwt.sign(
                { userId: decoded.userId, email: decoded.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ packages: pkgs, error: '', jwtToken: newToken });

        } catch(e) {
            error = e.toString();
            return res.status(500).json({ packages: [], error: error, jwtToken: ''});
        }
    });
}