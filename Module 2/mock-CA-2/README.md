# WorkshopGuard — Defensive Workshop Booking API

## Problem Statement

Complete an in-memory workshop booking API. Implement ten TODOs covering request IDs, validation, sanitisation, safe input handling, booking rules, responses, lookup, and Express pipeline assembly.

Tests import the Express app directly. Do not use Postman or start a server.

## Files to Edit

- `middleware/requestId.js`
- `validators/booking.validator.js`
- `middleware/validateRequest.js`
- `utils/selectBookingFields.js`
- `routes/bookings.js`
- `index.js`

Do not edit `store/`, `spec/`, `package.json`, `middleware/notFound.js`, or `middleware/errorHandler.js`.

## Booking Rules

Client may provide only:

```javascript
{
  attendeeName: 'Asha Rao',
  email: 'asha@example.com',
  workshop: 'node',
  seats: 2
}
```

- `attendeeName`: string, trimmed, escaped, 2–50 characters
- `email`: trimmed, valid, and normalised
- `workshop`: lowercase `node` or `express`
- `seats`: integer from 1–4
- Each workshop has 5 seats total
- Same email cannot book same workshop twice
- Server controls `id`, `status`, and `createdAt`

## Tasks

1. Complete request-ID middleware and return same UUID through `X-Request-Id`.
2. Add body validation and sanitisation chains for all booking fields.
3. Return every validation failure using required structured `400` response.
4. Allowlist permitted fields instead of copying complete request body.
5. Reject duplicate email/workshop booking with `409 DUPLICATE_BOOKING`.
6. Reject requests exceeding workshop capacity with `409 WORKSHOP_FULL`.
7. Create and store booking with generated ID, confirmed status, and ISO timestamp.
8. Return successful creation with status `201` and `{ data, requestId }`.
9. Validate booking ID and handle found, invalid, and missing records.
10. Assemble middleware and router correctly in `index.js`.

Follow comments and hints beside each TODO in starter files.

## Input Example

```javascript
POST /bookings

{
  "attendeeName": "  Asha Rao  ",
  "email": "ASHA@EXAMPLE.COM",
  "workshop": " NODE ",
  "seats": "2"
}
```

## Expected Output Example

Status: `201`

```javascript
{
  "data": {
    "id": 1,
    "attendeeName": "Asha Rao",
    "email": "asha@example.com",
    "workshop": "node",
    "seats": 2,
    "status": "confirmed",
    "createdAt": "2026-07-20T10:15:30.000Z"
  },
  "requestId": "7dc87bc9-5bbe-44f0-98f3-93422515a8e0"
}
```

`X-Request-Id` response header must contain same request ID.

## Test Cases and Marks

**10 tests × 2 marks = 20 marks**

1. **Request identity — 2 marks:** Generates a valid UUID, stores it on `req.id`, and returns the same value through `X-Request-Id` so downstream handlers and clients share one identifier.
2. **Validation and sanitisation — 2 marks:** Trims and escapes attendee name, normalises email, converts workshop to lowercase, and converts accepted seat input to a number.
3. **Validation boundary — 2 marks:** Stops invalid input with status `400`, returns `VALIDATION_ERROR`, and includes every failed field instead of only the first failure.
4. **Field allowlisting — 2 marks:** Keeps only `attendeeName`, `email`, `workshop`, and `seats`, removing protected or unknown fields such as `id`, `status`, `role`, and `isApproved`.
5. **Duplicate protection — 2 marks:** Rejects a second booking using the same normalised email and workshop with status `409` and code `DUPLICATE_BOOKING`.
6. **Capacity protection — 2 marks:** Adds existing and requested seats for the selected workshop and returns `409 WORKSHOP_FULL` when total exceeds five.
7. **Stored booking — 2 marks:** Creates one record with generated numeric ID, sanitised input, `confirmed` status, and a valid ISO timestamp.
8. **Creation response — 2 marks:** Returns status `201` with exactly `{ data, requestId }`, using the same request ID supplied by middleware.
9. **Booking lookup — 2 marks:** Returns `200` for an existing numeric ID, `400 INVALID_ID` for invalid values, and `404 BOOKING_NOT_FOUND` for absent records.
10. **Pipeline and safe errors — 2 marks:** Correctly routes malformed JSON, bodies larger than `2kb`, and unknown URLs to safe JSON errors without exposing internal details.

## How to Test

Run:

```bash
npm test
```

Complete all ten TODOs until all ten tests pass.