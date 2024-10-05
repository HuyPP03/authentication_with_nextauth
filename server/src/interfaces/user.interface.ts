import { Types } from 'mongoose';

export interface IUser {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	avatar: string;
	provider: 'credentials' | 'google' | 'facebook' | 'github';
	role: 'admin' | 'user';
	verified: boolean | null;
	verificationCode: string | null;
	expireAt: number | null;
	googleId: string;
	facebookId: string;
	githubId: string;
	bio: string;
	createAt: Date;
	updateAt: Date;
	__v?: number;
}
