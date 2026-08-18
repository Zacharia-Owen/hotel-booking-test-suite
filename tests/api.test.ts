import { test, expect } from '@playwright/test';

test.describe('Tier 2 - API Tests', () => {

  test('GET /api/rooms returns 3 rooms', async ({ request }) => {
    const response = await request.get('http://localhost:5000/api/rooms');

    expect(response.status()).toBe(200);

    const rooms = await response.json();
    expect(rooms).toHaveLength(3);
    expect(rooms[0]).toHaveProperty('name');
    expect(rooms[0]).toHaveProperty('price');
  });

  test('POST /api/bookings creates a booking successfully', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        checkin: '2027-07-01',
        checkout: '2027-07-05',
        roomID: 1
      }
    });

    expect(response.status()).toBe(201);

    const booking = await response.json();
    expect(booking).toHaveProperty('id');
    expect(booking.firstname).toBe('Jane');
    expect(booking.email).toBe('jane@example.com');
  });

  test('POST /api/bookings returns 400 when fields are missing', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'Jane',
        lastname: 'Smith'
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('DELETE /api/bookings/:id removes a booking', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:5000/auth/login', {
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
    });
    const { token } = await loginResponse.json();

    // creating a booking to delete
    const createResponse = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'Delete',
        lastname: 'Me',
        email: 'delete@example.com',
        phone: '1111111111',
        checkin: '2027-08-01',
        checkout: '2027-08-05',
        roomID: 1
      }
    });

    const booking = await createResponse.json();

    const deleteResponse = await request.delete(
      `http://localhost:5000/api/bookings/${booking.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(deleteResponse.status()).toBe(204);
  });

  test('GET /api/bookings/:id returns a single booking', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:5000/auth/login', {
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
    });

    const { token } = await loginResponse.json();

    const createResponse = await request.post('http://localhost:5000/api/bookings', {
      data: {
        firstname: 'Fetch',
        lastname: 'Book',
        email: 'fetch@example.com',
        phone: '2222222222',
        checkin: '2027-09-01',
        checkout: '2027-09-05',
        roomID: 1
      }
    });
    const booking = await createResponse.json();

    const response = await request.get(
      `http://localhost:5000/api/bookings/${booking.id}`,
      { headers: { Authorization: `Bearer ${token}` }}
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(booking.id);
    expect(body.firstname).toBe('Fetch');
  });

  test('GET /api/bookings/:id returns 404 for non-existent booking', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:5000/auth/login', {
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
    });

    const { token } = await loginResponse.json();

    const response = await request.get(
      'http://localhost:5000/api/bookings/9999',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status()).toBe(404);
  });

  test('GET /api/bookings/:id returns 400 for malformed ID', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:5000/auth/login', {
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
    });

    const { token } = await loginResponse.json();

    const response = await request.get(
      'http://localhost:5000/api/bookings/invalid-id',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(response.status()).toBe(400);
  });
});