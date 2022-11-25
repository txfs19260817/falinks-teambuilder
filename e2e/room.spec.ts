import { expect, test } from '@playwright/test';

test('should navigate to a new room', async ({ page, baseURL, browser, browserName }) => {
  // Start from the index page
  await page.goto(baseURL || 'http://localhost:3000/');
  // Click the "Draw a name" button to get an author name
  await page.getByRole('button', { name: 'Draw a name' }).click();
  await expect(page.getByRole('textbox', { name: 'Author' })).toHaveValue(/^[a-zA-Z ]*$/);
  // Fill the room name with Date.now() + browserName
  const currentRoomName = `${Date.now()}${browserName}`;
  const roomNameInput = page.getByRole('textbox', { name: 'Room name' });
  await roomNameInput.fill(currentRoomName);
  // Enter to submit the form
  await roomNameInput.press('Enter');
  // Wait for navigation
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  // The new URL should contain currentRoomName
  await expect(page).toHaveURL(new RegExp(`/${currentRoomName}/`));

  // Start collaborating
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
  await page.getByLabel('Move 3').fill('er');
  await page.getByRole('cell', { name: 'Order Up' }).click();
  await page.getByLabel('Move 4').click();
  await page.getByLabel('Move 4').fill('li');
  await page.getByRole('cell', { name: 'Liquidation' }).click();
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

test('should undo and redo', async ({ page, baseURL, browserName }) => {
  // Start from the room page
  await page.goto(baseURL ? `${baseURL}/room/${Date.now()}${browserName}` : `http://localhost:3000/room/${Date.now()}${browserName}`);
  await page.getByRole('tab', { name: 'Add new tab' }).click();
  const tab1 = page.getByRole('tab', { name: 'Tab 1' });
  await expect(tab1).toBeVisible();
  await page.getByRole('button', { name: '↩️ Undo' }).click();
  await expect(tab1).not.toBeVisible();
  await page.getByRole('button', { name: '↪️ Redo' }).click();
  await expect(tab1).toBeVisible();
});