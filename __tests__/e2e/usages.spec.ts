import { expect, test } from '@playwright/test';

test('should navigate across formats among Smogon Usages pages', async ({ page, baseURL }) => {
  // Start from the usage page
  await page.goto(baseURL ? `${baseURL}/usages/smogon` : 'http://localhost:3000/usages/smogon');
  // Wait for navigation
  await page.waitForNavigation();
  // The page should contain a sprite img
  await expect(page.getByRole('img', { name: 'Pokémon' })).toBeVisible();
  // The page should contain a table cell with "Items"
  await expect(page.getByRole('cell', { name: 'Items' })).toBeVisible();
  // The page should contain a table cell with "Moves"
  await expect(page.getByRole('cell', { name: 'Moves' })).toBeVisible();
  // The page should contain a table cell with "Teammates"
  await expect(page.getByRole('cell', { name: 'Teammates' })).toBeVisible();
  // The page should contain a table cell with "Spreads"
  await expect(page.getByRole('cell', { name: 'Spreads' })).toBeVisible();

  // Go to the 'gen8vgc2022' page
  await page.getByRole('listbox', { name: 'Format Selector' }).selectOption('gen8vgc2022');
  // Wait for navigation
  await page.waitForNavigation();
  // The new URL should contain "/usages/gen8vgc2022"
  await expect(page).toHaveURL(/\/usages\/smogon\/gen8vgc2022/);
  // The new page should contain a sprite img
  await expect(page.getByRole('img', { name: 'Pokémon' })).toBeVisible();
  // The new page should contain a table cell with "Items"
  await expect(page.getByRole('cell', { name: 'Items' })).toBeVisible();
  // The new page should contain a table cell with "Moves"
  await expect(page.getByRole('cell', { name: 'Moves' })).toBeVisible();
  // The new page should contain a table cell with "Teammates"
  await expect(page.getByRole('cell', { name: 'Teammates' })).toBeVisible();
  // The new page should contain a table cell with "Spreads"
  await expect(page.getByRole('cell', { name: 'Spreads' })).toBeVisible();
  // The page should contain an input with "Filter by name"
  await expect(page.getByPlaceholder('Filter by name')).toBeVisible();
});

test('should navigate to VGCPastes Usages pages', async ({ page, baseURL }) => {
  // Start from the usage page
  await page.goto(baseURL ? `${baseURL}/usages/vgc` : 'http://localhost:3000/usages/vgc');
  // Wait for navigation
  await page.waitForNavigation();
  // The page should contain a sprite img
  await expect(page.getByRole('img', { name: 'Pokémon' })).toBeVisible();
  // The page should contain a table cell with "Items"
  await expect(page.getByRole('cell', { name: 'Items' })).toBeVisible();
  // The page should contain a table cell with "Moves"
  await expect(page.getByRole('cell', { name: 'Moves' })).toBeVisible();
  // The page should contain a table cell with "Teammates"
  await expect(page.getByRole('cell', { name: 'Teammates' })).toBeVisible();
  // The page should contain a table cell with "Tera Type"
  await expect(page.getByRole('cell', { name: 'Tera Type' })).toBeVisible();
  // The page should contain a table cell with "Spreads"
  await expect(page.getByRole('cell', { name: 'Spreads' })).toBeVisible();
  // The page should contain an input with "Filter by name"
  await expect(page.getByPlaceholder('Filter by name')).toBeVisible();
});
