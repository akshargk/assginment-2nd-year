const repo = require("./../repository/postsRepo");
const AppError = require("./../utils/AppError");

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // a post may only be edited within 24h

exports.getAll = async () => repo.findAll();
exports.create = async ({ authorId, title, body }) =>
  repo.insert({ authorId, title, body });

/**
 * TODO (Domain rule): edit a post.
 * Implement these guards IN ORDER, each throwing an AppError, before any write:
 *   1. The post must exist          -> AppError('Post not found', 404)
 *   2. Only the author may edit it  -> AppError('You can only edit your own post', 403)
 *   3. It must be within the window  -> AppError('Post can no longer be edited', 403)
 *      (now - post.createdAt must be <= EDIT_WINDOW_MS)
 * Only when all guards pass: return repo.update(postId, changes).
 */

// EDITED: Implemented the post-editing domain rules in the required order.
exports.editPost = async (postId, userId, changes) => {
  // EDITED: Guard 1 — check that the post exists.
  const post = await repo.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // EDITED: Guard 2 — only the post's author can edit it.
  if (post.authorId !== userId) {
    throw new AppError("You can only edit your own post", 403);
  }

  // EDITED: Guard 3 — reject edits after the 24-hour window.
  const elapsedTime = Date.now() - new Date(post.createdAt).getTime();

  if (elapsedTime > EDIT_WINDOW_MS) {
    throw new AppError("Post can no longer be edited", 403);
  }

  // EDITED: Update only after all three guards pass.
  return repo.update(postId, changes);

  // REMOVED:
  // throw new AppError('editPost is not implemented yet', 501);
  // REASON: The edit workflow is now implemented.
};
