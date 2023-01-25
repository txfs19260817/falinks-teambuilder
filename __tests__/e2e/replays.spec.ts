import { expect, test } from '@playwright/test';

test('should navigate to replay page', async ({ page, baseURL }) => {
  // Start from the home page
  await page.goto(baseURL ? `${baseURL}/replays/` : 'http://localhost:3000/replays/');
  // Wait for navigation
  await page.waitForNavigation();
  // The new URL should contain "replays"
  await expect(page).toHaveURL(/replays/);
  // Perform a search
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('listbox', { name: 'Format Selector' }).selectOption('gen9vgc2023series1');
  await page.getByPlaceholder('Pokémon ...').click();
  await page.getByPlaceholder('Pokémon ...').fill('do');
  await page.getByRole('option', { name: 'Dondozo Dondozo' }).getByText('Dondozo').click();
  await page.getByPlaceholder('Pokémon ...').fill('pa');
  await page.getByRole('option', { name: 'Pawmot Pawmot' }).getByText('Pawmot').click();
  await page.getByPlaceholder('Pokémon ...').fill('tal');
  await page.getByRole('option', { name: 'Talonflame Talonflame' }).getByText('Talonflame').click();
  await page.getByText('Created At⇵').click();
  await expect(page.getByRole('img', { name: 'Dondozo' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Pawmot' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Talonflame' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Animod1' }).first()).toBeVisible();
});

test('should find related replays in Paste page', async ({ page, baseURL }) => {
  // Start from Penguin's December Ladder 1st Place Team page
  await page.goto(baseURL ? `${baseURL}/pastes/clcjr2ugq000wsgoy1utfb2ud/` : 'http://localhost:3000/pastes/clcjr2ugq000wsgoy1utfb2ud/');
  await page.waitForNavigation();

  // Switch to Replay tab
  await page.getByRole('tab', { name: 'Replays' }).click();
  // Sort by Created At
  await page.getByText('Created At⇵').click();
  await expect(page.getByRole('img', { name: 'Baxcalibur' }).first()).toBeVisible();
});
