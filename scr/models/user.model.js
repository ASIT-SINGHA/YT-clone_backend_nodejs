import { mongoose, Schema } from "mongoose";
import { jwt, sign } from "jsonwebtoken";
import { bcrypt } from "bcrypt";

const UserSchema = new Schema(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		fullName: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
		},
		coverImage: {
			type: String,
		},
		watchHistry: [
			{
				videoId: Schema.Types.ObjectId,
				ref: "Video",
			},
		],
		password: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

UserSchema.methods.isCorrectPasword = async function (password) {
	return await bcrypt.campare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			fullName: this.fullName,
			userName: this.userName,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: ACCESS_TOKEN_EXPIRY }
	);
};
UserSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.ACCESS_REFRESH_SECRET,
		{ expiresIn: ACCESS_REFRESH_EXPIRY }
	);
};

export const User = mongoose.model("User", UserSchema);
