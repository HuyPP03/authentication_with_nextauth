import User from '../models/users.model';
import env from '../../env';
import mongoose from 'mongoose';

const dbConfig = env.database;

const connectToDatabase = async () => {
	try {
		await mongoose.connect(
			`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`,
		);
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

export const db = {
	users: User,
	connectToDatabase,
};
