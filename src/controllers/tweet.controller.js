import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
	//TODO: create tweet
	const text = req.body?.content;

	if (!text) {
		throw new ApiError(200, "text is required.");
	}

	const tweet = await Tweet.create({
		content: text,
		owner: req.user._id,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, tweet.content, "tweet is successfully posted."));
});

const getUserTweets = asyncHandler(async (req, res) => {
	const userId = req.params?.userId;
	console.log(userId);

	// TODO: get user tweets
	const getTweet = await Tweet.findOne({ onwer: userId });

	return res
		.status(200)
		.json(
			new ApiResponse(200, getTweet.content, "tweet fatched successfully."),
		);
});

const updateTweet = asyncHandler(async (req, res) => {
	//TODO: update tweet

	const tweetId = req.params.tweetId;
	const text = req.body?.content;

	if (!(tweetId && text)) {
		throw new ApiError(400, "tweet id  and text is required.");
	}

	const tweetDoc = await Tweet.findById(tweetId);

	if (!tweetId) {
		throw new ApiError(400, "such no tweet id in db");
	}
	// console.log(tweetDoc.owner,typeof tweetDoc.owner);
	// console.log(req.user._id,typeof req.user._id);

	if (!tweetDoc.owner.equals(req.user._id)) {
		throw new ApiError(400, "you are not owner of this tweet");
	}

	const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
		content: text,
	});

	return res
		.status(200)
		.json(
			new ApiResponse(200, updatedTweet.content, "tweet update successfully."),
		);
});

const deleteTweet = asyncHandler(async (req, res) => {
	//TODO: delete tweet
	const tweetId = req.params.tweetId;

	if (!tweetId) {
		throw new ApiError(400, "tweet id required.");
	}

	const tweetDoc = await Tweet.findById(tweetId);

	if (!tweetDoc.owner.equals(req.user._id)) {
		throw new ApiError(400, "you are not owner of this tweet");
	}

	await Tweet.deleteOne(tweetDoc._id);

	return res
		.status(200)
		.json(new ApiResponse(200, "tweet delete successfully. "));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
