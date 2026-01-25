import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const uploadAVideo = asyncHandler(async (req, res) => {
	const { title, description, isPublished } = req.body;
	const owner = req.user._id;
	const videoFilePath = req.files?.videoFile?.[0].path;
	const thumbnailFilePath = req.files?.thumbnail?.[0].path;

	if (!(videoFilePath && thumbnailFilePath && title && description)) {
		throw new ApiError(
			400,
			"video , thumbnail, title, description is required.",
		);
	}

	const videoFileUpload = await uploadOnCloudinary(videoFilePath);
	const thumbnailFileUpload = await uploadOnCloudinary(thumbnailFilePath);

	const video = Video.create({
		videoFile: videoFileUpload.url,
		thumbnail: thumbnailFileUpload.url,
		title: title,
		description: description,
		duration: videoFileUpload.duration,
		isPublished: isPublished,
		owner: owner,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, "video uploaded successfully."));
});
const getAllVideo = asyncHandler(async (req, res) => {
	const allVideos = await Video.aggregate([
		{ $match: { owner: new mongoose.Types.ObjectId(req.user._id) } },
		{
			$project: {
				videoFile: 1,
				title: 1,
				description: 1,
				thumbnail: 1,
				duration: 1,
				views: 1,
			},
		},
	]);

	return res
		.status(200)
		.json(new ApiResponse(200, allVideos, "all video fatched successfully."));
});
const getVideoById = asyncHandler(async (req, res) => {
	const aVideo = await Video.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(req.params.videoId) } },
		{
			$project: {
				videoFile: 1,
				title: 1,
				description: 1,
				thumbnail: 1,
				duration: 1,
				views: 1,
			},
		},
	]);

	return res
		.status(200)
		.json(new ApiResponse(200, aVideo, "A video fatched successfully."));
});
const updateVideo = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	const thumbnailFilePath = req.file?.path;

	if (!(thumbnailFilePath && title && description)) {
		throw new ApiError(400, "thumbnail, title, description is required.");
	}

	const oldthumbnailpath = await Video.findById(req.params.videoId);

	const thumbnailFileUpload = await uploadOnCloudinary(thumbnailFilePath);

	if (!thumbnailFilePath) {
		throw new ApiError(500, "upload failed.");
	}

	await Video.findByIdAndUpdate(
		req.params.videoId,
		{
			$set: {
				thumbnail: thumbnailFileUpload?.url,
			},
		},
		{ new: true },
	);

	const splitedOldUrl = oldthumbnailpath.thumbnail.split(/[/.]/);
	const oldthumbnailFileName = splitedOldUrl[splitedOldUrl.length - 2];
	cloudinary.uploader.destroy(oldthumbnailFileName);

	cloudinary.uploader.destroy();
	return res.status(200).json(new ApiResponse(200, "updated successfully."));
});
const togglePulishVideo = asyncHandler(async (req, res) => {
	const videoId = req.params?.videoId;
	const isPublish = req.body?.isPublished;

	if (!videoId && isPublish) {
		throw new ApiError(400, "videoid  or toggle value required.");
	}

	await Video.findByIdAndUpdate(
		videoId,
		{ isPublished: isPublish },
		{ new: true },
	);

	return res
		.status(200)
		.json(new ApiResponse(200, "toggle video is succussfully update"));
});
const deleteVideo = asyncHandler(async (req, res) => {
	const vidId = req.params.videoId;

	if (!vidId) {
		throw new ApiError(200, "video id is required.");
	}

	await Video.findByIdAndDelete(vidId, { new: true });

	return res
		.status(200)
		.json(new ApiResponse(200, "video deleted successfully."));
});

export {
	uploadAVideo,
	getAllVideo,
	updateVideo,
	togglePulishVideo,
	deleteVideo,
	getVideoById,
};
