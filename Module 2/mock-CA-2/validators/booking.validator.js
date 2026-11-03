const { body } = require("express-validator");

/*
 * TODO 2: Build validation and sanitisation chains for:
 *
 * attendeeName: string, trimmed, escaped, 2-50 characters
 * email: trimmed, valid email, then normalised
 * workshop: trimmed, lowercase, either "node" or "express"
 * seats: integer from 1-4, converted to a number
 *
 * Give every failed rule a clear message.
 * Hint: All four values arrive through req.body.
 */
const bookingValidation = [
  // Add validation chains here.
  body("attendeeName")
    .isString()
    .withMessage("attendeeName mush be a string")
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 })
    .withMessage("attendeename must be 2-50 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),

  body("workshop")
    .trim()
    .toLowerCase()
    .isIn(["node", "express"])
    .withMessage("workshop must be node or express"),

  body("seats")
    .isInt({ min: 1, max: 4 })
    .withMessage("seats must be an integer from 1-4")
    .toInt(),
];

module.exports = bookingValidation;
