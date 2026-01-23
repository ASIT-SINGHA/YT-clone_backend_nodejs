import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema(
	{
		content: {
			type: String,
			required: true,
			trim: true,
		},
		vidoe: {
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

commentSchema.plugin(mongooseAggregatePaginate);
export const Comment = model("Comment", commentSchema);
