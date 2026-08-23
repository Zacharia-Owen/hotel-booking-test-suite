import { test as base, request as apiRequest } from '@playwright/test';
import { API_BASE_URL } from '../config/apiConfig';

type AuthFixtures = {
  authToken: string;
};

export const test = base.extend<{}, AuthFixtures>({
  authToken: [async ({}, use) => {
    const context = await apiRequest.newContext();

    const loginResponse = await context.post(`${API_BASE_URL}/auth/login`, {
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      },
    });
    const { token } = await loginResponse.json();

    await context.dispose();

    await use(token);
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';