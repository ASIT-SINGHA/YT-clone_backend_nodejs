import { mongoose, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema(
	{
		videoFile: {
			type: String,
			required: true,
		},
		thumnail: {
			type: String,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		duration: {
			type: Number,
		},
		viwes: {
			type: Number,
			default: 0,
		},
		isPublished: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

VideoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", VideoSchema);
