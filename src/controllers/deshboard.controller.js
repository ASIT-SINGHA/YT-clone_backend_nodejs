import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const isCreator = await User.findOne({
		_id: userId,
		isChannel: { $exists: true },
	});

	if (!isCreator) {
		throw new ApiError(400, "you're not a creator. create a channel first");
	}

	const user = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
		{
			$lookup: {
				from: "videos",
				localField: "_id",
				foreignField: "owner",
				as: "totalVidoesAndTotalViews",
				pipeline: [{ $project: { views: 1 } }],
			},
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "channel",
				as: "totalSubscriber",
			},
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "channel",
				as: "subscribers",
			},
		},
		{
			$addFields: {
				totalVidoes: { $size: "$totalVidoesAndTotalViews" },
				totalViews: { $sum: "$views" },
				subcribersCount: { $size: "$totalSubscriber" },
				isSubscribed: {
					$cond: {
						if: { $in: [req.user?._id, "$subscribers.subscriber"] },
						then: true,
						else: false,
					},
				},
			},
		},
		{
			$project: {
				username: 1,
				fullname: 1,
				avatar: 1,
				coverImage: 1,
				channelLink: 1,
				description: 1,
				socialMediaLinks: 1,
				totalVidoes: 1,
				totalViews: 1,
				subcribersCount: 1,
				isSubscribed: 1,
			},
		},
	]);

	return res
		.status(200)
		.json(new ApiResponse(200, user, "feched successfully."));
});

const getChannelVideos = asyncHandler(async (req, res) => {
	const allVideos = await Video.find({ owner: req.user._id });
	return res
		.status(200)
		.json(new ApiResponse(200, allVideos, "feched successfully."));
});

export { getChannelStats, getChannelVideos };
