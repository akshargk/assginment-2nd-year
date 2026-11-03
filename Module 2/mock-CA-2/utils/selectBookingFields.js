/*
 * TODO 4: Return only fields clients are permitted to supply:
 * attendeeName, email, workshop, and seats.
 * Unknown or protected fields such as id, status, role,
 * isApproved, and createdAt must not cross this boundary.
 * Hint: Select known properties instead of copying the full body.
 */
function selectBookingFields(body) {
  const { attendeeName, email, workshop, seats } = body;

  return {
    attendeeName,
    email,
    workshop,
    seats,
  };
}

module.exports = selectBookingFields;
