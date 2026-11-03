const postsRepo = require("./../repository/postsRepo");
const votesRepo = require("./../repository/votesRepo");
const AppError = require("./../utils/AppError");

/**
 * TODO (Domain rule): cast a vote, one per user per post.
 * Implement these guards before writing:
 *   1. The post must exist                 -> AppError('Post not found', 404)
 *   2. The user must not have voted already -> AppError('You have already voted on this post', 409)
 * Only when both pass: return votesRepo.insert(postId, userId).
 */

// EDITED: Implemented the vote workflow with both guards before writing.
exports.castVote = async (postId, userId) => {
  // EDITED: Guard 1 — check whether the post exists.
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // EDITED: Guard 2 — prevent the same user from voting twice.
  // EDITED: Use votesRepo.find(), which already exists in the repository.
  const existingVote = await votesRepo.find(postId, userId);

  if (existingVote) {
    throw new AppError("You have already voted on this post", 409);
  }

  // EDITED: Insert the vote only after both guards pass.
  return votesRepo.insert(postId, userId);

  // REMOVED:
  // throw new AppError('castVote is not implemented yet', 501);
  // REASON: The vote workflow is now implemented.
};

exports.countFor = async (postId) => votesRepo.countByPost(postId);
