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
		video: [
			{
				type: Schema.Types.ObjectId,
				ref: "Video",
			},
		],
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

export const PlayList = model("PlayList", playListstSchema);
