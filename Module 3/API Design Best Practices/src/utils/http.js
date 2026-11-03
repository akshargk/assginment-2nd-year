function sendList(res, rows, meta = {}) {
  // REMOVED: return res.status(200).json(rows);
  // REASON: Returning a raw array does not provide a consistent
  // response envelope or pagination metadata.

  // EDITED: Return list data and pagination metadata consistently.
  return res.status(200).json({
    data: rows,
    meta,
  });
}

function sendCreated(res, post) {
  // REMOVED: return res.status(200).json({ post });
  // REASON: Creation should return HTTP 201, and the response
  // should use the standard { data: ... } envelope.

  // EDITED: Return 201 Created with the created post inside data.
  return res.status(201).json({
    data: post,
  });
}

function sendOk(res, payload) {
  // REMOVED: return res.status(200).json(payload);
  // REASON: Returning arbitrary payloads creates inconsistent
  // response shapes across endpoints.

  // EDITED: Wrap successful responses in { data: ... }.
  return res.status(200).json({
    data: payload,
  });
}

function sendError(res, status, payload) {
  // REMOVED: return res.status(status).json(payload);
  // REASON: Different controllers could send different error shapes.

  // EDITED: Standardize error responses.
  // Only expose a safe message; do not send stack traces or internals.
  const code =
    status === 400
      ? "BAD_REQUEST"
      : status === 404
        ? "NOT_FOUND"
        : status >= 500
          ? "INTERNAL_ERROR"
          : "REQUEST_ERROR";

  const message =
    status >= 500
      ? "Something went wrong"
      : payload.message || "Request failed";

  return res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

module.exports = {
  sendList,
  sendCreated,
  sendOk,
  sendError,
};
