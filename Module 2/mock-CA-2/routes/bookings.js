const express = require("express");
const bookingValidation = require("../validators/booking.validator");
const validateRequest = require("../middleware/validateRequest");
const selectBookingFields = require("../utils/selectBookingFields");
const bookingStore = require("../store/bookingStore");

const router = express.Router();
const MAX_WORKSHOP_SEATS = 5;

router.post("/", bookingValidation, validateRequest, (req, res) => {
  const input = selectBookingFields(req.body);

  /*
   * TODO 5: Search existing bookings for the same normalised
   * email and workshop. If found, stop with status 409,
   * error.code "DUPLICATE_BOOKING", and requestId: req.id.
   * Hint: bookingStore already exposes findDuplicate().
   */
  const duplicate = bookingStore.findDuplicate(input.email, input.workshop);

  if (duplicate) {
    return res.status(409).json({
      error: {
        code: "DUPLICATE_BOOKING",
        message: "Booking already exists",
      },
      requestId: req.id,
    });
  }

  /*
   * TODO 6: Add seats already reserved for input.workshop to
   * input.seats. If total exceeds MAX_WORKSHOP_SEATS, stop with
   * status 409, error.code "WORKSHOP_FULL", and requestId: req.id.
   * Hint: bookingStore.reservedSeats(workshop) returns current total.
   */
  const reservedSeats = bookingStore.reservedSeats(input.workshop);
  const hasCapacity = reservedSeats + input.seats <= MAX_WORKSHOP_SEATS;

  if (!hasCapacity) {
    return res.status(409).json({
      error: {
        code: "WORKSHOP_FULL",
        message: "Requested seats are unavailable",
      },
      requestId: req.id,
    });
  }

  /*
   * TODO 7: Create and store booking containing:
   * generated numeric id, allowed input fields, status "confirmed",
   * and createdAt as an ISO timestamp.
   * Hint: Use bookingStore.generateId(), bookingStore.add(),
   * and new Date().toISOString().
   */
  const booking = {
    id: bookingStore.generateId(),
    ...input,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  bookingStore.add(booking);

  /*
   * TODO 8: Return created resource using correct HTTP semantics.
   * Exact body: { data: booking, requestId: req.id }
   * Hint: Creation uses a different success status from retrieval.
   */
  return res.status(201).json({
    data: booking,
    requestId: req.id,
  });
});

router.get("/:id", (req, res) => {
  /*
   * TODO 9: Convert route parameter before lookup and handle all paths.
   * Non-positive/non-integer id -> 400 with code "INVALID_ID".
   * Missing booking -> 404 with code "BOOKING_NOT_FOUND".
   * Found booking -> 200 with { data: booking, requestId: req.id }.
   * Hint: Route parameters arrive as strings; stored IDs are numbers.
   */
  const id = parseInt(req.params.id, 10);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: {
        code: "INVALID_ID",
      },
      requestId: req.id,
    });
  }

  const booking = bookingStore.findById(id);

  if (!booking) {
    return res.status(404).json({
      error: {
        code: "BOOKING_NOT_FOUND",
      },
      requestId: req.id,
    });
  }

  return res.status(200).json({
    data: booking || null,
    requestId: req.id,
  });
});

module.exports = router;
