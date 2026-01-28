import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { text } from "express";

const getVideoComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a video
	const { videoId } = req.params;

	if (!videoId) {
		throw new ApiError(400, "video id is required.");
	}

	const allCommentOnVideo = await Comment.aggregate([
		{
			$match: {
				video: new mongoose.Types.ObjectId(videoId),
			},
		},
		{ $project: { content: 1 } },
	]);

	if (!allCommentOnVideo) {
		throw new ApiError(400, "on this video does not have any comments.");
	}

	console.log(allCommentOnVideo);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				allCommentOnVideo,
				"all comment fetch successfully.",
			),
		);
});

const addComment = asyncHandler(async (req, res) => {
	// TODO: add a comment to a video
	const { videoId } = req.params;
	const text = req.body?.content;

	if (!videoId) {
		throw new ApiError(400, "video id is required.");
	}

	const commentDoc = await Comment.findOne({
		video: videoId,
		owner: req.user._id,
	});

	if (!commentDoc) {
		await Comment.create({
			content: text,
			video: videoId,
			owner: req.user._id,
		});
	}
	return res
		.status(200)
		.json(new ApiResponse(200, text, "comment added successfully."));
});

const updateComment = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	const text = req.body?.content;

	if (!(commentId && text)) {
		throw new ApiError(400, "commentId and new comment is required.");
	}

	const commentDoc = await Comment.findById(commentId);

	if (!commentDoc) {
		throw new ApiError(400, "wrong comment id.");
	}

	if (!commentDoc.owner.equals(req.user._id)) {
		throw new ApiError(400, "you are not owner of this comment");
	}
	await Comment.updateOne({ content: text });

	return res
		.status(200)
		.json(new ApiResponse(200, text, "comment updated successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
	const { commentId } = req.params;

	if (!commentId) {
		throw new ApiError(200, "comment id is required.");
	}

	const commentDoc = await Comment.findById(commentId);

	if (!commentDoc) {
		throw new ApiError(400, " comment not found");
	}

	if (!commentDoc.owner.equals(req.user._id)) {
		throw new ApiError(200, "your are not owner of this comment");
	}

	await Comment.deleteOne(commentDoc._id);

	return res
		.status(200)
		.json(new ApiResponse(200, "comment deleted successfully."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
