import { test, Page, chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_FILE = path.join(__dirname, '../playwright/.auth/user.json');

export async function login(page: Page) {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) {
    throw new Error('TEST_EMAIL and TEST_PASSWORD env variables must be set');
  }
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[name="username"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3000/');
}

export async function saveAuthState(page: Page) {
  await page.context().storageState({ path: AUTH_FILE });
}

export const authenticatedTest = test.extend({
  storageState: async ({}, _use) => {
    // If auth file exists, use it; otherwise, login and save
    if (fs.existsSync(AUTH_FILE)) {
      await _use(AUTH_FILE);
    } else {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      await login(page);
      await saveAuthState(page);
      await browser.close();
      await _use(AUTH_FILE);
    }
  },
});