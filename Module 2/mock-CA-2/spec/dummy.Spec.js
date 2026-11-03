const express = require('express');
const request = require('supertest');

const requestId = require('../middleware/requestId');
const bookingValidation = require('../validators/booking.validator');
const validateRequest = require('../middleware/validateRequest');
const selectBookingFields = require('../utils/selectBookingFields');
const { app, resetStore } = require('../index');

const validBooking = (overrides = {}) => ({
  attendeeName: 'Asha Rao',
  email: 'asha@example.com',
  workshop: 'node',
  seats: 2,
  ...overrides
});

describe('Defensive Workshop Booking API', () => {
  beforeEach(() => {
    resetStore();
  });

  it('1. assigns one UUID to request, response header, and downstream handler', async () => {
    const miniApp = express();
    miniApp.use(requestId);
    miniApp.get('/', (req, res) => res.json({ requestId: req.id }));

    const response = await request(miniApp).get('/');
    const headerId = response.headers['x-request-id'];

    expect(response.status).toBe(200);
    expect(headerId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(response.body.requestId).toBe(headerId);
  });

  it('2. validates and sanitises all accepted booking fields', async () => {
    const miniApp = express();
    miniApp.use(express.json());
    miniApp.post('/', bookingValidation, (req, res) => res.json(req.body));

    const response = await request(miniApp).post('/').send({
      attendeeName: '  <b>Asha</b>  ',
      email: '  ASHA@EXAMPLE.COM  ',
      workshop: '  NODE  ',
      seats: '3'
    });

    expect(response.body.attendeeName).not.toContain('<');
    expect(response.body.attendeeName).not.toContain('>');
    expect(response.body.email).toBe('asha@example.com');
    expect(response.body.workshop).toBe('node');
    expect(response.body.seats).toBe(3);
  });

  it('3. blocks invalid input and returns every field-level error', async () => {
    const miniApp = express();
    miniApp.use(express.json());
    miniApp.use((req, res, next) => {
      req.id = 'req-validation';
      next();
    });
    miniApp.post('/', bookingValidation, validateRequest, (req, res) => {
      res.status(201).json({ reached: true });
    });

    const response = await request(miniApp).post('/').send({
      attendeeName: '',
      email: 'not-an-email',
      workshop: 'python',
      seats: 8
    });

    const fields = response.body.error?.details?.map((error) => error.field);

    expect(response.status).toBe(400);
    expect(response.body.error?.code).toBe('VALIDATION_ERROR');
    expect(fields).toEqual(jasmine.arrayContaining([
      'attendeeName',
      'email',
      'workshop',
      'seats'
    ]));
    expect(response.body.requestId).toBe('req-validation');
  });

  it('4. allowlists booking fields and drops protected or unknown input', () => {
    const selected = selectBookingFields({
      attendeeName: 'Asha',
      email: 'asha@example.com',
      workshop: 'node',
      seats: 2,
      id: 999,
      status: 'cancelled',
      role: 'admin',
      isApproved: true,
      createdAt: 'yesterday'
    });

    expect(selected).toEqual({
      attendeeName: 'Asha',
      email: 'asha@example.com',
      workshop: 'node',
      seats: 2
    });
  });

  it('5. rejects duplicate email and workshop pair with 409', async () => {
    await request(app).post('/bookings').send(validBooking());

    const response = await request(app).post('/bookings').send(
      validBooking({ attendeeName: 'Another Name' })
    );

    expect(response.status).toBe(409);
    expect(response.body.error?.code).toBe('DUPLICATE_BOOKING');
    expect(response.body.requestId).toBe(response.headers['x-request-id']);
  });

  it('6. rejects a booking that would exceed workshop capacity', async () => {
    await request(app).post('/bookings').send(
      validBooking({ email: 'first@example.com', seats: 4 })
    );

    const response = await request(app).post('/bookings').send(
      validBooking({ email: 'second@example.com', seats: 2 })
    );

    expect(response.status).toBe(409);
    expect(response.body.error?.code).toBe('WORKSHOP_FULL');
  });

  it('7. stores a generated, confirmed booking with ISO timestamp', async () => {
    const response = await request(app).post('/bookings').send(validBooking());
    const booking = response.body.data;

    expect(booking?.id).toBe(1);
    expect(booking?.status).toBe('confirmed');
    expect(Number.isNaN(Date.parse(booking?.createdAt))).toBeFalse();
    expect(booking?.attendeeName).toBe('Asha Rao');
    expect(booking?.seats).toBe(2);
  });

  it('8. returns exact creation status, envelope, and request ID', async () => {
    const response = await request(app).post('/bookings').send(validBooking());

    expect(response.status).toBe(201);
    expect(Object.keys(response.body).sort()).toEqual(['data', 'requestId']);
    expect(response.body.requestId).toBe(response.headers['x-request-id']);
    expect(response.body.data?.email).toBe('asha@example.com');
  });

  it('9. validates IDs and distinguishes found from missing bookings', async () => {
    await request(app).post('/bookings').send(validBooking());

    const found = await request(app).get('/bookings/1');
    const invalid = await request(app).get('/bookings/not-a-number');
    const missing = await request(app).get('/bookings/999');

    expect(found.status).toBe(200);
    expect(found.body.data?.id).toBe(1);
    expect(invalid.status).toBe(400);
    expect(invalid.body.error?.code).toBe('INVALID_ID');
    expect(missing.status).toBe(404);
    expect(missing.body.error?.code).toBe('BOOKING_NOT_FOUND');
  });

  it('10. wires malformed JSON, oversized bodies, and unknown routes into safe errors', async () => {
    const malformed = await request(app)
      .post('/bookings')
      .set('Content-Type', 'application/json')
      .send('{"attendeeName":');

    const oversized = await request(app).post('/bookings').send({
      attendeeName: 'A'.repeat(3000),
      email: 'large@example.com',
      workshop: 'node',
      seats: 1
    });

    const unknown = await request(app).get('/unknown-route');

    expect(malformed.status).toBe(400);
    expect(malformed.body.error).toEqual({
      code: 'INVALID_JSON',
      message: 'Request body contains invalid JSON'
    });
    expect(oversized.status).toBe(413);
    expect(oversized.body.error?.code).toBe('PAYLOAD_TOO_LARGE');
    expect(unknown.status).toBe(404);
    expect(unknown.body.error?.code).toBe('NOT_FOUND');
    expect(JSON.stringify(malformed.body)).not.toContain('SyntaxError');
    expect(malformed.body.requestId).toBe(malformed.headers['x-request-id']);
  });
});