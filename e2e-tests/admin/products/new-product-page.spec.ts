import { expect, test } from '@playwright/test';
import { authenticatedTest } from '../../auth.setup';
import path from 'path';

const EXAMPLE_IMAGE = path.join(__dirname, '../../assets/camera.jpg');

const exampleProduct = {
  name: 'Digital camera',
  description:
    'A high-quality digital camera suitable for photography enthusiasts.',
  tags: 'camera, electronics',
};

test.describe('Admin new product flow', () => {
  authenticatedTest(
    'Navigate to new product page and fill the form',
    async ({ page }) => {
      await page.route('*/**/api/ai/admin/products', async (route) => {
        const json = { description: exampleProduct.description };
        await route.fulfill({ json });
      });

      await page.goto('http://localhost:3000/');

      await page.getByRole('link', { name: 'Add new Product' }).click();

      await page.getByLabel('Name').fill(exampleProduct.name);
      await page.getByLabel('Tags (comma-separated)').fill(exampleProduct.tags);

      await page.getByRole('button', { name: 'Generate' }).click();
      await page.getByLabel('Image').setInputFiles(EXAMPLE_IMAGE);

      await page.getByRole('button', { name: 'Upload' }).click();

      await expect(
        page.getByText('Product created successfully!'),
      ).toBeVisible();
    },
  );


  authenticatedTest(
    'Show error message when Generate Description wasn\'t successful',
    async ({ page }) => {
      await page.route('*/**/api/ai/admin/products', async (route) => {
        const json = {
          error: 'Invalid product name',
          details: [{ message: 'Name must be at least 3 characters', path: ['name'] }],
        };
        await route.fulfill({ status: 400, json });
      });

      await page.goto('http://localhost:3000/admin/products/new');

      await page.getByRole('button', { name: 'Generate' }).click();

      await expect(
        page.getByText('Failed to generate description'),
      ).toBeVisible();
    },
  );
});
