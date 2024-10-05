import jwt from 'jsonwebtoken';
import env from '../../env';
import { PERMISSION_ERROR } from '../constants/constants';
import { db } from '../loaders/database.loader';
import { AppError } from '../utility/appError.util';
import { EncUtil } from '../utility/encryption';
import { IUser } from '../interfaces/user.interface';
import generateSixDigitString from '../utility/generateSixDigitString';

export async function authenticate(email: string, password: string) {
	const user = await db.users.findOne({ email: email });
	if (user == null) {
		throw new AppError(PERMISSION_ERROR, 'Email or password mismatch!');
	}
	if (user.provider !== 'credentials') {
		throw new AppError(
			PERMISSION_ERROR,
			'User not authenticated using credentials provider!',
		);
	}
	const isMatch = await EncUtil.comparePassword(password, user.password);

	if (!isMatch) {
		throw new AppError(PERMISSION_ERROR, 'Email or password mismatch!');
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
	username: string,
	email: string,
	password: string,
): Promise<IUser> {
	const existUser = await db.users.findOne({ email: email });

	if (existUser) {
		throw new AppError(PERMISSION_ERROR, 'Email already exists');
	}

	const hash = await EncUtil.createHash(password);

	const verificationCode = generateSixDigitString();
	const expireAt = Date.now() + 15 * 60 * 1000;

	const user = await db.users.create({
		username,
		email,
		password: hash,
		avatar: `${env.app.server_url}/uploads/default_avatar.png`,
		verificationCode,
		expireAt,
	});

	return user;
}

export async function verify(
	email: string,
	verificationCode: string,
): Promise<IUser> {
	const user = await db.users.findOne({
		email: email,
		verificationCode: verificationCode,
	});

	if (user == null) {
		throw new AppError(PERMISSION_ERROR, 'Verification code error!');
	}

	if (user.verified) {
		throw new AppError(PERMISSION_ERROR, 'User has already verified!');
	}

	if (!user.expireAt) {
		throw new AppError(
			PERMISSION_ERROR,
			'Verification code has expired! Please request a new one.',
		);
	}

	if (Date.now() > user.expireAt) {
		throw new AppError(PERMISSION_ERROR, 'Verification code expired!');
	}

	user.verified = true;
	user.verificationCode = undefined;
	user.expireAt = undefined;
	await user.save();
	return user;
}
