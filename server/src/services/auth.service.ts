import jwt from 'jsonwebtoken';
import env from '../../env';
import { PERMISSION_ERROR } from '../constants/constants';
import { db } from '../loaders/database.loader';
import { AppError } from '../utility/appError.util';
import { EncUtil } from '../utility/encryption';
import { IUser } from '../interfaces/user.interface';

export async function authenticate(email: string, password: string) {
	const user = await db.users.findOne({ where: { email: email } });
	if (user == null) {
		throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
	}
	const isMatch = await EncUtil.comparePassword(password, user.password);

	if (!isMatch) {
		throw new AppError(PERMISSION_ERROR, 'email or password mismatch');
	}

	return user;
}

export function getToken(user: IUser, expiresIn: string): string {
	return jwt.sign(
		{
			id: user._id,
			email: user.email,
		},
		env.app.jwtSecret,
		{
			expiresIn,
		},
	);
}

export async function register(
	name: string,
	email: string,
	password: string,
): Promise<IUser> {
	const user = await db.users.findOne({ email: email });

	const newUser =
		user ||
		(await db.users.create({
			name,
			email,
			password,
		}));

	return newUser;
}

export async function verify(token: string, password: string): Promise<IUser> {
	const user = jwt.verify(token, env.app.jwtSecret) as IUser;
	const userDb = await db.users.findOne({ _id: user._id });
	if (userDb == null) {
		throw new AppError(PERMISSION_ERROR, 'User not found');
	}
	userDb.password = await EncUtil.createHash(password);
	return await userDb.save();
}
