const postsRepo = require("./../repository/postsRepo");
const commentsRepo = require("./../repository/commentsRepo");
const AppError = require("./../utils/AppError");

/**
 * TODO (Multi-step workflow): add a comment to a post.
 * Model this as an ordered sequence of service methods, ALL CHECKS BEFORE ANY WRITE:
 *   1. The post must exist            -> AppError('Post not found', 404)
 *   2. The post must not be locked    -> AppError('Post is locked for new comments', 409)
 *   3. THEN insert the comment       -> commentsRepo.insert({ postId, authorId: userId, body })
 *   4. THEN bump the post's count     -> postsRepo.incrementCommentCount(postId)
 *   5. return the created comment
 * No write may happen before both checks pass.
 */

// EDITED: Implemented the ordered comment workflow.
exports.addComment = async (postId, userId, body) => {
  // EDITED: Check 1 — confirm the post exists before writing.
  const post = await postsRepo.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // EDITED: Check 2 — reject comments on locked posts.
  if (post.locked) {
    throw new AppError("Post is locked for new comments", 409);
  }

  // EDITED: Write 1 — insert the comment only after both checks pass.
  const comment = await commentsRepo.insert({
    postId,
    authorId: userId,
    body,
  });

  // EDITED: Write 2 — update the post's comment count.
  await postsRepo.incrementCommentCount(postId);

  // EDITED: Return the newly created comment.
  return comment;

  // REMOVED:
  // throw new AppError('addComment is not implemented yet', 501);
  // REASON: The function is now implemented instead of returning
  // a 501 Not Implemented error.
};
