import { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema<IUser>(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: false },
		avatar: { type: String, required: false },
		provider: {
			type: String,
			enum: ['credentials', 'google', 'facebook', 'github'],
			required: true,
			default: 'credentials',
		},
		role: {
			type: String,
			enum: ['admin', 'user'],
			required: true,
			default: 'user',
		},
		verified: { type: Boolean, required: false, default: false },
		verificationCode: {
			type: String,
			required: false,
			default: null,
		},
		expireAt: { type: Number, required: false },
		googleId: { type: String, required: false },
		facebookId: { type: String, required: false },
		githubId: { type: String, required: false },
		bio: { type: String, required: false },
	},
	{ timestamps: true },
);

const User = model<IUser>('User', userSchema);

export default User;
