const express = require("express");
const requestId = require("./middleware/requestId");
const bookingsRouter = require("./routes/bookings");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const bookingStore = require("./store/bookingStore");

const app = express();

/*
 * TODO 10: Assemble complete request pipeline in correct order.
 *
 * 1. request ID must exist before any body/route/error response
 * 2. parse JSON with a 2kb limit
 * 3. mount bookingsRouter at /bookings
 * 4. run notFound only after known routes
 * 5. keep errorHandler last
 *
 * Hint: Use app.use(). Do not call app.listen(); tests import app directly.
 */

app.use(requestId);
app.use(express.json({ limit: "2kb" }));
app.use("/bookings", bookingsRouter);
app.use(notFound);
app.use(errorHandler);

module.exports = {
  app,
  resetStore: bookingStore.reset,
};
