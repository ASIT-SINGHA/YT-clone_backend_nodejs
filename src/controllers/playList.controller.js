import mongoose, { isValidObjectId } from "mongoose";
import { PlayList } from "../models/playList.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description, videoId } = req?.body;

	if (!name) {
		throw new ApiError(400, "playlist name is required.");
	}

	const playlist = await PlayList.create({
		name: name,
		description: description || "",
		owner: req.user._id,
	});

	if (videoId) {
		playlist.video.push(videoId);
		await playlist.save();
	}

	return res
		.status(200)
		.json(new ApiResponse(200, playlist, "playlist create successfully."));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
	const { userId } = req?.params;

	if (!userId) {
		throw new ApiError(400, "user id required.");
	}

	const allPlaylist = await PlayList.find({ owner: userId });

	return res
		.status(200)
		.json(
			new ApiResponse(200, allPlaylist, "all playlist fetched successfully."),
		);
});

const getPlaylistById = asyncHandler(async (req, res) => {
	const { playlistId } = req?.params;
	const playListDoc = await PlayList.findById(playlistId);

	return res
		.status(200)
		.json(new ApiResponse(200, playListDoc, "playlist fetch successfully."));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req?.params;

	if (!(playlistId && videoId)) {
		throw new ApiError(400, "playlist id and video id is required.");
	}

	const playListDoc = await PlayList.findById(playlistId);

	if (!playListDoc._id.equals(playlistId)) {
		throw new ApiError(400, "you are not owner of this playlist.");
	}

	const isVideoExist = playListDoc.video.includes(videoId);

	if (isVideoExist) {
		throw new ApiError(400, "this video is already exist in playlist.");
	} else {
		playListDoc.video.push(videoId);
		await playListDoc.save();
	}

	return res
		.status(200)
		.json(new ApiResponse(200, playListDoc, "video added successfully."));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req?.params;

	if (!(playlistId && videoId)) {
		throw new ApiError(400, "playlist and video id is required.");
	}

	const playListDoc = await PlayList.findById(playlistId);
	console.log(playListDoc);

	if (playListDoc) {
		const isVideoExist = playListDoc.video.includes(videoId);

		if (isVideoExist) {
			playListDoc.video.pop(videoId);
			await playListDoc.save();
		} else {
			throw new ApiError(400, "playlist or video is not exist.");
		}
	}
	return res
		.status(200)
		.json(new ApiResponse(200, "vidoe delete from playlist successfully."));
});

const deletePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req?.params;

	if (!playlistId) {
		throw new ApiError(400, "playlist id is misiing.");
	}

	const playlistDoc = await PlayList.findById(playlistId);

	if (!playlistDoc) {
		throw new ApiError(400, "playlist is not exist.");
	}

	await PlayList.deleteOne({ _id: playlistId });

	return res
		.status(200)
		.json(new ApiResponse(200, "playlist deleted successfully."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req?.params;
	const { name, description } = req?.body;

	if (!playlistId) {
		throw new ApiError(400, "playlist id is required.");
	}

	const playListDoc = await PlayList.findById(playlistId);

	if (!playListDoc) {
		throw new ApiError(400, "playlist is not exist.");
	}

	await PlayList.findByIdAndUpdate(
		playlistId,
		{
			description: description || "",
			name: name || "",
		},
		{
			new: true,
		},
	);

	return res
		.status(200)
		.json(new ApiResponse(200, "playlist details update successfully."));
});

export {
	createPlaylist,
	getUserPlaylists,
	getPlaylistById,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylist,
	updatePlaylist,
};
