const { validationResult } = require("express-validator");
const requestId = require("./requestId");

function validateRequest(req, res, next) {
  /*
   * TODO 3: Stop invalid requests before route logic runs.
   * Return status 400 with error.code "VALIDATION_ERROR".
   * error.details must contain every failure as:
   * { field: <field name>, message: <validation message> }
   * Include req.id as requestId. Continue only when no errors exist.
   * Hint: validationResult(req).array() returns collected failures.
   */
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    const details = errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        details: details,
      },
      requestId: req.id,
    });
  }

  next();
}

module.exports = validateRequest;
