import { test, expect } from '@playwright/test';
import { test as authenticatedTest} from './playwright-auth.helper';
import path from 'path';

const exampleProduct = {
  name: 'Digital Photo Camera',
  description: 'A high-quality digital camera for photography enthusiasts.',
  tags: 'camera,photo,digital',
  image: 'test-image.webp'
}
const IMAGE_FILE = path.resolve(__dirname, '../e2e-tests/assets/', exampleProduct.image);


test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});


authenticatedTest('authenticated test', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/products/new');
  // Your test code here
});


authenticatedTest('test navigation', async ({ page }) => {
  // Mock the AI product description API
  await page.route('**/api/ai/admin/products', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ description: exampleProduct.description })
    });
  });

  await page.goto('/');
  await page.getByRole('link', { name: 'Add new Product' }).click();

  // Fill name field
  await page.getByLabel('Name').fill(exampleProduct.name);

  // Click Generate button to trigger the mocked API and fill description
  await page.getByRole('button', { name: /generate/i }).click();
  await expect(page.getByLabel('Description')).toHaveValue(exampleProduct.description);

  // Fill tags field
  await page.getByLabel('Tags (comma-separated)').fill(exampleProduct.tags);

  // Use file chooser to upload the image file
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByLabel('Image').click(),
  ]);
  await fileChooser.setFiles(IMAGE_FILE);

  // Submit the form
  await page.getByRole('button', { name: /upload/i }).click();

  // Check for success message and image display
  await expect(page.getByText('Image uploaded successfully!')).toBeVisible();
  await expect(page.locator('img[alt="abstract"]')).toBeVisible();
});
