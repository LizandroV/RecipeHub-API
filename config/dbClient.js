import mongoose from 'mongoose';
import 'dotenv/config';

class dbClient {
	constructor() {
		this.connectDB();
	}

	async connectDB(uri) {
		try {
			const dbName = 'recipeHUB';
			const connectionString =
				uri ||
				`mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@${process.env.SERVER_DB}/${dbName}?retryWrites=true&w=majority`;
			await mongoose.connect(connectionString);
			console.log(`Connected to the database ${dbName}`);
		} catch (error) {
			console.error(`Error connecting to the database: ${error}`);
		}
	}

	async closeConnection() {
		try {
			await mongoose.disconnect();
			console.log('Connection closed');
		} catch (e) {
			console.error('Error in disconnect: ', e);
		}
	}
}

export default new dbClient();
