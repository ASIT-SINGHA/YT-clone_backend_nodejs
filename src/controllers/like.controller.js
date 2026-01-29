import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
	const videoId = req.params?.videoId;

	if (!videoId) {
		throw new ApiError(400, "video Id is missing.");
	}

	const likeDoc = await Like.findOne({ video: videoId });

	if (!likeDoc) {
		await Like.create({
			video: videoId,
			likeBy: req.user._id,
		});
	} else {
		await Like.deleteOne(videoId);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, "vidoe like toggle successfully."));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
	const { commentId } = req.params;

	if (!commentId) {
		throw new ApiError(400, "comment Id is missing.");
	}

	const commentDoc = await Like.findOne({ comment: commentId });

	if (!commentDoc) {
		await Like.create({
			comment: commentId,
			likeBy: req.user._id,
		});
	} else {
		await Like.deleteOne(commentId);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, "comment like toggle successfully."));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;

	if (!tweetId) {
		throw new ApiError(400, "tweet Id is missing.");
	}

	const tweetDoc = await Like.findOne({ tweet: tweetId });

	if (!tweetDoc) {
		await Like.create({
			tweet: tweetId,
			likeBy: req.user._id,
		});
	} else {
		await Like.deleteOne(tweetId);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, "tweet like toggle successfully."));
});

const getLikedVideos = asyncHandler(async (req, res) => {
	const allLikedVideo = await Like.find({
		likeBy:req.user._id,
		video: { $exists: true, $ne: null },
	});

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				allLikedVideo,
				"fetch all liked video successfully.",
			),
		);
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
