function errorHandler(error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON'
      },
      requestId: req.id
    });
  }

  if (error.status === 413) {
    return res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body exceeds 2kb limit'
      },
      requestId: req.id
    });
  }

  if (error.status === 404) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found'
      },
      requestId: req.id
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    },
    requestId: req.id
  });
}

module.exports = errorHandler;