const { randomUUID } = require("node:crypto");

function requestId(req, res, next) {
  /*
   * TODO 1: Give every request one unique tracking ID.
   * Store it on req.id, return the same value through the
   * X-Request-Id response header, then continue the pipeline.
   * Hint: randomUUID() is already imported.
   */
  const id = randomUUID();
  req.id = id;
  res.setHeader("X-Request-Id", id);
  next();
}

module.exports = requestId;
