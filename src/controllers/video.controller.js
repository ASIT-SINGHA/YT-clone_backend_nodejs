import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadAVideo = asyncHandler(async (req, res) => {
	//algo
	// chech all req file or fields are present
	// if not throw error
	//yes then store video and thumbnail path and upload at local
	// if then upload on cloudnary
	//send proper response to user.

	// console.log(req.body);
	const { title, description, isPublished } = req.body;
	const ower = req.user._id;
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
	// console.log(videoFileOpload);

	const video = Video.create({
		videoFile: videoFilePath,
		thumbnail: thumbnailFilePath,
		title: title,
		description: description,
		duration: videoFileUpload.duration,
		isPublished: isPublished,
		owner: ower,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, "video uploaded successfully."));
});
const getAllVideo = asyncHandler(async (req, res) => {});
const getVideoById = asyncHandler(async (req, res) => {});
const updateVideo = asyncHandler(async (req, res) => {});
const togglePulishVideo = asyncHandler(async (req, res) => {});
const deleteVideo = asyncHandler(async (req, res) => {});

export {
	uploadAVideo,
	getAllVideo,
	updateVideo,
	togglePulishVideo,
	deleteVideo,
	getVideoById,
};
