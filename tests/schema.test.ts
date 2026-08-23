import { test, expect } from '../fixtures/auth';
import {
  BookingResponseSchema,
  ErrorResponseSchema,
  PaginatedRoomsResponseSchema,
} from '../schemas/booking.schema';
import { API_BASE_URL } from '../config/apiConfig';

test.describe('Tier 2b - API Contract Validation', () => {
  test('GET /api/rooms response matches the room contract', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/rooms`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    const result = PaginatedRoomsResponseSchema.safeParse(body);

    if (!result.success) {
      console.error(result.error.format());
    }
    expect(result.success).toBe(true);
  });

  test('POST /api/bookings response matches the booking contract', async ({ request }) => {
    const payload = {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane.doe@example.com',
      phone: '5551234567',
      checkin: '2026-09-01',
      checkout: '2026-09-03',
      roomID: 1,
    };

    const response = await request.post(`${API_BASE_URL}/api/bookings`, { data: payload });
    expect(response.status()).toBe(201);

    const body = await response.json();
    const result = BookingResponseSchema.safeParse(body);

    if (!result.success) {
      console.error(result.error.format());
    }
    expect(result.success).toBe(true);
  });

  test('POST /api/bookings with missing fields returns a well-formed error body', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/bookings`, {
      data: { firstname: 'Jane' }, // deliberately incomplete
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    const result = ErrorResponseSchema.safeParse(body);

    if (!result.success) {
      console.error(result.error.format());
    }
    expect(result.success).toBe(true);
  });

  test('POST /api/bookings with an invalid room ID is rejected with a real error message', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/bookings`, {
      data: {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        phone: '5551234567',
        checkin: '2026-09-01',
        checkout: '2026-09-03',
        roomID: 999999, // does not exist
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Room does not exist');
  });

  test('GET /api/bookings without a token is rejected (protected route)', async ({ request }) => {

    const response = await request.get(`${API_BASE_URL}/api/bookings`);
    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.error).toBe('No token provided');
  });

  test('GET /api/bookings with a valid token returns booking records', async ({ request, authToken }) => {
    const bookingsResponse = await request.get(`${API_BASE_URL}/api/bookings`, {
      headers: { Authorization: `Bearer ${authToken}` }, // authToken should be defined in your test setup
    });
    expect(bookingsResponse.ok()).toBeTruthy();

    const bookings = await bookingsResponse.json();
    expect(Array.isArray(bookings)).toBe(true);
  });
});