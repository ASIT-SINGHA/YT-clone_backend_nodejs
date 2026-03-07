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
		{ $project: { content: 1 ,owner: 1, createdAt: 1} },
	]);

	if (allCommentOnVideo.length === 0) {
		return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				allCommentOnVideo,
				"this video does not have any comments.",
			),
		);
	}


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

	if (!videoId || !text) {
		throw new ApiError(400, "video id and comment content is required.");
	}


	
		const newComment =await Comment.create({
			content: text,
			video: videoId,
			owner: req.user._id,
		});

	return res
		.status(201)
		.json(new ApiResponse(201, newComment, "comment added successfully."));
});

const updateComment = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	const text = req.body?.content;

	if (!(commentId && text)) {
		throw new ApiError(400, "commentId and new comment is required.");
	}

	const commentDoc = await Comment.findById(commentId);

	if (!commentDoc) {
		throw new ApiError(404, "comment not found.");
	}

	if (!commentDoc.owner.equals(req.user._id)) {
		throw new ApiError(403, "you are not owner of this comment");
	}
	await Comment.updateOne({ _id: commentId },
		{ $set: { content: text }});

	return res
		.status(200)
		.json(new ApiResponse(200, text, "comment updated successfully."));
});

const deleteComment = asyncHandler(async (req, res) => {
	const { commentId } = req.params;

	if (!commentId) {
		throw new ApiError(400, "comment id is required.");
	}

	const commentDoc = await Comment.findById(commentId);

	if (!commentDoc) {
		throw new ApiError(404, " comment not found");
	}

	if (!commentDoc.owner.equals(req.user._id)) {
		throw new ApiError(203, "your are not owner of this comment");
	}

	await Comment.deleteOne({ _id: commentId });

	return res
		.status(200)
		.json(new ApiResponse(200, "comment deleted successfully."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
