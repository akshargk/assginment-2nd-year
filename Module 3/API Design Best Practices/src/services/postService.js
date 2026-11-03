const store = require("../data/postStore");

function listPosts(query = {}) {
  // intentionally poor design: no pagination, no metadata, no contract standardisation

  // REMOVED: return store.getAllPosts();
  // REASON: Returning every post gives the client no pagination metadata
  // and can cause performance problems with large lists.

  // EDITED: Get the posts and apply server-side pagination.
  const posts = store.getAllPosts();

  // EDITED: Default limit is 2 for this exercise; maximum is 100.
  const parsedLimit = parseInt(query.limit, 10) || 2;
  const limit = Math.min(Math.max(parsedLimit, 1), 100);

  // EDITED: Ensure page is a positive integer.
  const parsedPage = parseInt(query.page, 10) || 1;
  const page = Math.max(parsedPage, 1);

  // EDITED: Calculate the total number of posts and the page offset.
  const total = posts.length;
  const offset = (page - 1) * limit;

  // EDITED: Return only the requested page.
  const data = posts.slice(offset, offset + limit);

  // EDITED: Calculate pagination metadata.
  const pages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      pages,
    },
  };
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author,
  });
}

function likePost(id) {
  const post = store.incrementLikes(id);

  if (!post) {
    // REMOVED:
    // const err = new Error('POSTS_TABLE missing row while incrementing likes');
    // err.statusCode = 500;
    // err.debug = 'FakeStack: at postService.js:19:11';
    // throw err;
    //
    // REASON: A missing post is a 404, not an internal server error.
    // Do not expose fake database messages or implementation details.

    // EDITED: Throw a safe, client-appropriate missing-resource error.
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  return post;
}

function explode() {
  // KEPT: This route intentionally creates an internal error for testing.
  // The error must be hidden from the public response by app.js middleware.

  // REMOVED:
  // const err = new Error('SQLITE_CONSTRAINT in posts table');
  // err.statusCode = 500;
  // throw err;
  //
  // REASON: The public-facing demo should not expose database details.

  // EDITED: Simulate an internal failure without exposing implementation details.
  const err = new Error("Simulated internal failure");
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode,
};
