import { Subscription } from "../models/subcription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
	/*
		algo
		receive chennel id 
		find user._id and chennel_id in subscription model 
		y-> delete doc n -> create doc
		return res
	*/
	const chennelId = req.params?.channelId;
	const eUser = req.user._id;

	if (!chennelId) {
		throw new ApiError(400, "chennel id  required.");
	}

	const subscribedDoc = await Subscription.findOne({ subscriber: eUser }).where(
		{
			channel: chennelId,
		},
	);

	if (!subscribedDoc) {
		await Subscription.create({
			subscriber: eUser,
			channel: chennelId,
		});
		console.log("subscribed");
	} else {
		await Subscription.deleteOne({ _id: subscribedDoc._id });
		console.log("unsubscribed");
	}

	return res.status(200).json(new ApiResponse(200, "opration is done."));
});

const getSubscriber = asyncHandler(async (req, res) => {
	const allSubscriber = await Subscription.aggregate([
		{
			$match: {
				channel: new mongoose.Types.ObjectId(req.user._id),
			},
		},
		{
			$count: "totalSubcribers",
		},
	]);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				allSubscriber[0].totalSubcribers,
				"all subscriber is fatched.",
			),
		);
});

const getChannel = asyncHandler(async (req, res) => {
	const getChannel = await Subscription.aggregate([
		{
			$match: {
				subscriber: new mongoose.Types.ObjectId(req.user._id),
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "channel",
				foreignField: "_id",
				as: "channelInfo",
				pipeline: [
					{
						$project: {
							username:1,
							avatar:1,
						},
					},
				],
			},
		},
		{ $unwind: { path: "$channelInfo", preserveNullAndEmptyArrays: true } },
		{
			$project: {
				subscriber: 1,
				channel: 1,
        "channelInfo.username": 1,
        "channelInfo.avatar": 1
			},
		},
	]);

	return res
	.status(200)
	.json(new ApiResponse(200,getChannel,"all channel fatched successfully."))
});

export { getSubscriber, toggleSubscription, getChannel };
