import * as dotenv from 'dotenv';
import * as path from 'path';
import { description, name, version } from './package.json';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

/**
 * Environment variables
 */

export default {
	app: {
		server_url: process.env.SERVER_URL || 'http://localhost:3005',
		base_url: process.env.BASE_URL || 'http://localhost:3000',
		isProduction: process.env.NODE_ENV === 'production',
		root_path: path.join(process.cwd()),
		name,
		version,
		description,
		port: Number(process.env.PORT) || 3000,
		saltRounds: Number(process.env.SALT_ROUNDS) || 10,
		cors: process.env.CORS?.split(',') || '*',
		jwtSecret: process.env['JWT_SECRET'] || '123456',
		jwtExpiredIn: process.env['JWT_EXPIRED_IN'] || '1d',
		debugLog: process.env.DEBUG_LOG === 'true',
	},
	database: {
		host: process.env.DB_HOST || '127.0.0.1',
		port: Number(process.env.DB_PORT) || '27017',
		name: process.env.DB_NAME || 'demo',
		max: Number(process.env.DB_POOL_MAX) || 5,
		min: Number(process.env.DB_POOL_MIN) || 0,
		acquire: Number(process.env.DB_POOL_ACQUIRE) || 30000,
		idle: Number(process.env.DB_POOL_IDLE) || 10000,
		logging: process.env.DB_LOGGING === 'true',
		isSync: process.env.DB_SYNC === 'false',
	},
	mail: {
		host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
		port: process.env.MAIL_PORT || '2525',
		user: process.env.MAIL_USER || '740ba294e9d57f',
		pass: process.env.MAIL_PASS || 'd5ff0cc1a9a948',
		from: process.env.MAIL_FROM_NAME || 'Platform',
	},
};
