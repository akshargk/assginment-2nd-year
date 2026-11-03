let nextBookingId = 1;
const bookings = [];

function generateId() {
  return nextBookingId++;
}

function add(booking) {
  bookings.push(booking);
  return booking;
}

function findDuplicate(email, workshop) {
  return bookings.find(
    (booking) => booking.email === email && booking.workshop === workshop
  );
}

function reservedSeats(workshop) {
  return bookings
    .filter((booking) => booking.workshop === workshop)
    .reduce((total, booking) => total + booking.seats, 0);
}

function findById(id) {
  return bookings.find((booking) => booking.id === id);
}

function reset() {
  bookings.length = 0;
  nextBookingId = 1;
}

module.exports = {
  generateId,
  add,
  findDuplicate,
  reservedSeats,
  findById,
  reset
};