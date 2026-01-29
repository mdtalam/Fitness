const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const db = getDb();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const authorId = req.query.authorId;

        const query = {};
        if (authorId && authorId !== 'undefined' && /^[0-9a-fA-F]{24}$/.test(authorId)) {
            query.authorId = new ObjectId(authorId);
        }

        const totalPosts = await db.collection('forumposts').countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);

        const posts = await db.collection('forumposts').aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: {
                    path: '$author',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    'author.password': 0,
                    'author.firebaseUid': 0,
                    'author.__v': 0
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]).toArray();

        res.status(200).json({
            status: 'success',
            data: {
                posts,
                pagination: {
                    totalPosts,
                    totalPages,
                    currentPage: page,
                    limit
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching forum posts',
            error: error.message
        });
    }
};

// @desc    Vote on a forum post
// @route   PATCH /api/forum/:id/vote
// @access  Private
exports.votePost = async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { voteType } = req.body; // 'up' or 'down'
        const userId = req.user._id;

        if (!['up', 'down'].includes(voteType)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid vote type'
            });
        }

        const post = await db.collection('forumposts').findOne({ _id: new ObjectId(id) });
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        // Initialize votedBy if it doesn't exist
        const votedBy = post.votedBy || [];
        const existingVoteIndex = votedBy.findIndex(v => v.userId.toString() === userId.toString());

        let upVotes = post.upVotes || 0;
        let downVotes = post.downVotes || 0;

        if (existingVoteIndex > -1) {
            const previousVote = votedBy[existingVoteIndex].voteType;
            if (previousVote === voteType) {
                // If clicking same vote, remove it (toggle off)
                votedBy.splice(existingVoteIndex, 1);
                if (voteType === 'up') upVotes--;
                else downVotes--;
            } else {
                // Changing vote type
                votedBy[existingVoteIndex].voteType = voteType;
                votedBy[existingVoteIndex].votedAt = new Date();
                if (voteType === 'up') {
                    upVotes++;
                    downVotes--;
                } else {
                    downVotes++;
                    upVotes--;
                }
            }
        } else {
            // New vote
            votedBy.push({
                userId: new ObjectId(userId),
                voteType,
                votedAt: new Date()
            });
            if (voteType === 'up') upVotes++;
            else downVotes++;
        }

        await db.collection('forumposts').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    votedBy,
                    upVotes: Math.max(upVotes, 0),
                    downVotes: Math.max(downVotes, 0),
                    updatedAt: new Date()
                }
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                upVotes: Math.max(upVotes, 0),
                downVotes: Math.max(downVotes, 0),
                userVote: votedBy.find(v => v.userId.toString() === userId.toString())?.voteType || null
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error voting on forum post',
            error: error.message
        });
    }
};

// @desc    Get single forum post
// @route   GET /api/forum/:id
// @access  Public
exports.getPost = async (req, res) => {
    try {
        const db = getDb();
        const post = await db.collection('forumposts').aggregate([
            { $match: { _id: new ObjectId(req.params.id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: '$author' },
            {
                $project: {
                    'author.firebaseUid': 0,
                    'author.updatedAt': 0,
                    'author.createdAt': 0,
                    'author.__v': 0
                }
            }
        ]).next();

        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Forum post not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching forum post',
            error: error.message
        });
    }
};

// @desc    Create new post
// @route   POST /api/forum
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const db = getDb();
        const newPostData = {
            ...req.body,
            authorId: new ObjectId(req.user._id),
            authorName: req.user.name,
            authorRole: req.user.role,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('forumposts').insertOne(newPostData);
        const savedPost = { _id: result.insertedId, ...newPostData };

        res.status(201).json({
            status: 'success',
            data: {
                post: savedPost
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating forum post',
            error: error.message
        });
    }
};

// @desc    Update a forum post
// @route   PATCH /api/forum/:id
// @access  Private
exports.updatePost = async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const post = await db.collection('forumposts').findOne({ _id: new ObjectId(id) });
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        // Only author or admin can update
        if (post.authorId.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to update this post'
            });
        }

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        // Don't allow updating these fields manually
        delete updateData._id;
        delete updateData.authorId;
        delete updateData.authorName;
        delete updateData.authorRole;
        delete updateData.votedBy;
        delete updateData.upVotes;
        delete updateData.downVotes;

        await db.collection('forumposts').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        const updatedPost = await db.collection('forumposts').findOne({ _id: new ObjectId(id) });

        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating forum post',
            error: error.message
        });
    }
};

// @desc    Delete a forum post
// @route   DELETE /api/forum/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const post = await db.collection('forumposts').findOne({ _id: new ObjectId(id) });
        if (!post) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        // Only author or admin can delete
        if (post.authorId.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this post'
            });
        }

        await db.collection('forumposts').deleteOne({ _id: new ObjectId(id) });

        res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting forum post',
            error: error.message
        });
    }
};

// @desc    Add a comment to a forum post
// @route   POST /api/forum/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const db = getDb();
        const { id } = req.params;
        const { text } = req.body;
        const { _id: userId, name: userName, photoURL: userPhoto } = req.user;

        if (!text || text.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Comment text is required'
            });
        }

        const newComment = {
            id: new ObjectId(), // Unique ID for the comment
            userId: new ObjectId(userId),
            userName,
            userPhoto,
            text,
            createdAt: new Date()
        };

        const result = await db.collection('forumposts').updateOne(
            { _id: new ObjectId(id) },
            {
                $push: { comments: newComment },
                $set: { updatedAt: new Date() }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Post not found'
            });
        }

        res.status(201).json({
            status: 'success',
            data: {
                comment: newComment
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error adding comment',
            error: error.message
        });
    }
};
