import { expect, test } from '@playwright/test';

test('should navigate to a new room', async ({ page, baseURL, browser }) => {
  // Start from the index page
  await page.goto(baseURL || 'http://localhost:3000/');
  // Click the "Draw a name" button to get an author name
  await page.getByRole('button', { name: 'Draw a name' }).click();
  await expect(page.getByRole('textbox', { name: 'Author' })).toHaveValue(/^[a-zA-Z ]*$/);
  // Click the "Create Room" button
  await page.getByRole('button', { name: 'Create Room' }).click();
  // Wait for navigation
  await page.waitForNavigation();
  // The new URL should contain "/room/"
  await expect(page).toHaveURL(/\/room\//);

  // Start collaboarting
  // Create another page in another browser context
  const context = await browser.newContext();
  const page2 = await context.newPage();
  // Navigate to the new room in the second page
  await page2.goto(page.url());
  // Wait for the second page to load
  await page2.waitForLoadState('networkidle');
  // The second page should have the same URL as the first page
  await expect(page2).toHaveURL(page.url());
  // add a Pokémon on the first page
  await page.getByRole('tab', { name: 'Add new tab' }).click();
  await page.getByLabel('Species').click();
  await page.getByLabel('Species').press('Control+a');
  await page.getByLabel('Species').fill('dond');
  await page.getByRole('cell', { name: 'Dondozo' }).click();
  await page.getByLabel('Item').click();
  await page.getByLabel('Item').fill('clear');
  await page.getByRole('cell', { name: 'Clear Amulet' }).click();
  await page.getByLabel('Ability').click();
  await page.getByRole('cell', { name: 'Unaware' }).click();
  await page.getByRole('cell', { name: 'Earthquake' }).click();
  await page.getByRole('cell', { name: 'Protect' }).click();
  await page.getByLabel('Move 3').click();
  await page.getByLabel('Move 3').fill('rd');
  await page.getByRole('cell', { name: 'Order Up' }).click();
  await page.getByLabel('Move 4').click();
  await page.getByLabel('Move 4').fill('wave');
  await page.getByRole('cell', { name: 'Wave Crash' }).click();
  await page.getByRole('listbox', { name: 'Suggested EV spreads' }).selectOption('Bulky Physical Sweeper: 252 HP / 252 Atk / 4 SpD / (+Atk, -SpA)');

  // verify the outcome on the second page
  await page2.getByRole('tab', { name: 'Tab 1' }).click();
  await page2.getByText('Status').click();
  await expect(page2.getByRole('cell', { name: 'hp stat' })).toHaveText('257');
  await expect(page2.getByRole('cell', { name: 'atk stat' })).toHaveText('167');
  await expect(page2.getByRole('cell', { name: 'def stat' })).toHaveText('135');
  await expect(page2.getByRole('cell', { name: 'spa stat' })).toHaveText('76');
  await expect(page2.getByRole('cell', { name: 'spd stat' })).toHaveText('86');
  await expect(page2.getByRole('cell', { name: 'spe stat' })).toHaveText('55');
});
