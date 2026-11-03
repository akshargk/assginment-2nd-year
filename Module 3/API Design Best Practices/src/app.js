const express = require("express");
const postRoutes = require("./routes/postRoutes");
const { resetData } = require("./data/postStore");
const controller = require("./controllers/postController");

function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/", postRoutes);
  app.get("/explode", controller.explode);

  // TODO:
  // - make public contract resource-oriented
  // - standardise success envelope
  // - standardise error envelope
  // - add pagination metadata on list route
  // - cap limit server-side (default limit = 2 for exercise)
  // - stop exposing old verb routes as public contract
  // - expose safe internal failure route for testing/demo

  // EDITED: Added centralized error-handling middleware.
  // Controllers should call next(err) to reach this handler.
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // EDITED: Log internal errors on the server, not in the response.
    if (statusCode >= 500) {
      console.error(err);
    }

    // REMOVED: Returning stack traces or internal error details to clients.
    // REASON: Public error responses must not leak implementation details.

    // EDITED: Standardized error envelope.
    return res.status(statusCode).json({
      error: {
        code:
          statusCode === 404
            ? "NOT_FOUND"
            : statusCode === 400
              ? "BAD_REQUEST"
              : "INTERNAL_ERROR",
        message: statusCode >= 500 ? "Something went wrong" : err.message,
      },
    });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;

  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

// KEPT: Original exports for starting the app and resetting test data.
module.exports = {
  createApp,
  resetData,
};
