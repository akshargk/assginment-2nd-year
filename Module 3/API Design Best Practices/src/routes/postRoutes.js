const express = require("express");
const controller = require("../controllers/postController");

const router = express.Router();

// EDITED: Changed GET /getPosts to GET /posts.
// The HTTP method already indicates that this route fetches posts.
//router.get('/getPosts', controller.listPosts);
router.get("/posts", controller.listPosts);

// EDITED: Changed GET /getPost/:id to GET /posts/:id.
// Uses a predictable resource path to fetch one post.
// router.get('/getPost/:id', controller.getPost);
router.get("/posts/:id", controller.getPost);

// EDITED: Changed POST /createPost to POST /posts.
// POST on the collection creates a new post.
// router.post('/createPost', controller.createPost);
router.post("/posts", controller.createPost);

// EDITED: Changed POST /likePost/:id to POST /posts/:id/likes.
// A like is represented as a resource belonging to a post.
// router.post('/likePost/:id', controller.likePost);
router.post("/posts/:id/likes", controller.likePost);

// EDITED: Export the router so app.js can mount these routes.
module.exports = router;
