import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/modelUsers.js';

export function generateToken(email) {
	return jsonwebtoken.sign({ email }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: '1h',
	});
}

export async function validateToken(req, res, next) {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ error: 'Token Required' });
	}

	try {
		const dataToken = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET);
		const user = await User.findOne({ email: dataToken.email });

		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}

		req.user = user;
		next();
	} catch (e) {
		return res.status(401).json({ error: 'Token Invalid', e });
	}
}
