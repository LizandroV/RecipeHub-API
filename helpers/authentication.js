import 'dotenv/config';
import jsonwebtoken from 'jsonwebtoken';

export function generateToken(email) {
	return jsonwebtoken.sign({ email }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: '1h',
	});
}

export function validateToken(req, res, next) {
	const token = req.header('Authorization')?.replace('Bearer ', '');
	console.log(token);

	if (!token) {
		return res.status(401).json({ error: 'Token Required' });
	}

	try {
		const dataToken = jsonwebtoken.verify(token, process.env.JWT_TOKEN_SECRET);
		console.log(dataToken.email);
		// return res.status(200).json({ msg: 'Token Valid'})
		req.emailConnected = dataToken.email;
		next();
	} catch (e) {
		return res.status(401).json({ error: 'Token Invalid', e });
	}
}
