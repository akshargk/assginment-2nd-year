const service = require("../services/postService");
const http = require("../utils/http");

// EDITED: Added next so errors can be forwarded to Express middleware.
function listPosts(req, res, next) {
  try {
    const rows = service.listPosts(req.query);

    // REMOVED: return http.sendList(res, rows);
    // REASON: This may not include pagination metadata.

    // EDITED: Handle paginated results using { data, meta }.
    if (Array.isArray(rows)) {
      return http.sendList(res, rows);
    }

    return res.status(200).json({
      data: rows.data,
      meta: rows.meta,
    });
  } catch (err) {
    // EDITED: Forward errors to centralized error middleware.
    return next(err);
  }
}

// EDITED: Added next for centralized error handling.
function getPost(req, res, next) {
  try {
    const post = service.getPost(req.params.id);

    if (!post) {
      // REMOVED: return http.sendError(res, 404, { message: 'post missing' });
      // REASON: The error response needs a consistent error envelope.

      // EDITED: Standardized missing-post response.
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Post not found",
        },
      });
    }

    return http.sendOk(res, post);
  } catch (err) {
    return next(err);
  }
}

// EDITED: Added next for centralized error handling.
function createPost(req, res, next) {
  try {
    const post = service.createPost(req.body);

    // KEPT: return http.sendCreated(res, post);
    // It should return status 201 with the created resource in { data: ... }.
    return http.sendCreated(res, post);
  } catch (err) {
    return next(err);
  }
}

// EDITED: Added next and a missing-post check.
function likePost(req, res, next) {
  try {
    const post = service.likePost(req.params.id);

    if (!post) {
      // REMOVED: return http.sendOk(res, { ok: true, likes: post.likes });
      // EDITED: Return a consistent error if the post does not exist.
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Post not found",
        },
      });
    }

    // REASON: Removed the unnecessary "ok" field to keep the response
    // focused on the resource data. Keep it if your API contract requires it.

    // EDITED: Return the like count in the standard data envelope.
    return http.sendOk(res, { likes: post.likes });
  } catch (err) {
    return next(err);
  }
}

// EDITED: Added next for centralized error handling.
function explode(req, res, next) {
  try {
    service.explode();

    // REMOVED:
    // return http.sendError(res, 500, {
    //   error: err.message,
    //   stack: err.debug || err.stack
    // });
    //

    // EDITED: Defensive fallback if service.explode() unexpectedly returns.
    return res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong",
      },
    });
  } catch (err) {
    // REASON: This exposes internal error details and stack traces.
    // EDITED: Forward the error to app.js error middleware instead.
    return next(err);
  }
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
};
