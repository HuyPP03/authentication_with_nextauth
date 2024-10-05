import { NextFunction, Request, Response } from 'express';
import { PERMISSION_ERROR, RESPONSE_SUCCESS } from '../constants/constants';
import * as authService from '../services/auth.service';
import { AppError } from '../utility/appError.util';
import env from '../../env';
import ResponseData from '../utility/responseData';
import { db } from '../loaders/database.loader';

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await authService.authenticate(
			req.body.email,
			req.body.password,
		);
		if (user == null) {
			throw new AppError(PERMISSION_ERROR, 'Email or password mismatch!');
		}
		return res
			.status(RESPONSE_SUCCESS)
			.json(ResponseData(user, 200, 'Login Successfully!'));
	} catch (e) {
		next(e);
	}
};

export const register = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username, email, password } = req.body;
		const user = await authService.register(username, email, password);
		return res
			.status(201)
			.json(ResponseData(user, 201, 'Register Successfully!'));
	} catch (e) {
		next(e);
	}
};

export const verify = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, verificationCode } = req.body;
		const user = await authService.verify(email, verificationCode);
		return res
			.status(RESPONSE_SUCCESS)
			.json(ResponseData(user, RESPONSE_SUCCESS, 'Verify Successfully!'));
	} catch (e) {
		next(e);
	}
};

export const checkProvider = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email } = req.body;
		const user = await db.users.findOne({ email: email }, 'email provider');
		return res
			.status(RESPONSE_SUCCESS)
			.json(
				ResponseData(
					user,
					RESPONSE_SUCCESS,
					'Check Provider Successfully!',
				),
			);
	} catch (e) {
		next(e);
	}
};

export const createUserWithProvider = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { username, email, provider, providerId, avatar } = req.body;
		const obj: any = {
			email,
			provider,
			avatar,
			username,
			role: 'user',
			verified: true,
		};
		if (provider === 'google') {
			obj.googleId = providerId;
		}
		if (provider === 'facebook') {
			obj.facebookId = providerId;
		}
		if (provider === 'github') {
			obj.githubId = providerId;
		}
		const user = await db.users.create(obj);

		return res
			.status(RESPONSE_SUCCESS)
			.json(
				ResponseData(
					user,
					RESPONSE_SUCCESS,
					'Create User With Provider Successfully!',
				),
			);
	} catch (e) {
		next(e);
	}
};
