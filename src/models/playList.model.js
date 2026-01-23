import mongoose, { Schema, model } from "mongoose";

const playListstSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		video: {
			type: Schema.Types.ObjectId,
			ref: "Video",
		},
		onwer: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true },
);

export const PlayList = model("PlayList", playListstSchema);
