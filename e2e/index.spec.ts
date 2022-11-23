import { expect, test } from '@playwright/test';

import { AppConfig } from '@/utils/AppConfig';

test('should navigate to the home page', async ({ page, baseURL }) => {
  // Go to the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto(baseURL || 'http://localhost:3000/');
  // Expect to have h1 with the app name
  await expect(page.locator('h1')).toHaveText(AppConfig.title);
  // Expect to have a form to create a new room
  await expect(page.getByRole('form')).toBeVisible();

  // Form
  // Author input
  // Expect the form to have a text input for the author name
  const authorInput = page.getByRole('textbox', { name: 'Author' });
  await expect(authorInput).toBeVisible();
  // Expect the form to have a button to fill the author name with a random name
  const randomNameButton = page.getByRole('button', { name: 'Draw a name' });
  await expect(randomNameButton).toBeVisible();
  // Click the button to fill the author name with a random name
  await randomNameButton.click();
  // Expect the author name to be filled with a random name
  await expect(authorInput).toHaveValue(/^[a-zA-Z ]*$/);

  // PokePaste input
  // Expect the form to have a text input for the PokePaste URL
  const pokePasteInput = page.getByRole('textbox', { name: 'PokePaste URL' });
  await expect(pokePasteInput).toBeVisible();
  // Expect the PokePaste URL input to have a placeholder starting with "https://pokepast.es/"
  await expect(pokePasteInput).toHaveAttribute('placeholder', /^https:\/\/pokepast.es\//);

  // Room name input
  // Expect the form to have a text input for the room name
  const roomNameInput = page.getByRole('textbox', { name: 'Room name' });
  await expect(roomNameInput).toBeVisible();
  // Expect the Room name input to already have a value
  await expect(roomNameInput).toHaveValue(/^[a-zA-Z0-9_]*$/);

  // Protocol checkboxes
  // Expect the form to have a checkbox for the "WebSocket" protocol, and it should be checked by default
  const wsCheckbox = page.getByRole('radio', { name: 'WebSocket' });
  await expect(wsCheckbox).toBeVisible();
  await expect(wsCheckbox).toBeChecked();
  // Expect the form to have a checkbox for the "WebRTC" protocol, and it should not be checked by default
  const webrtcCheckbox = page.getByRole('radio', { name: 'WebRTC' });
  await expect(webrtcCheckbox).toBeVisible();
  await expect(webrtcCheckbox).not.toBeChecked();

  // Create room submit button
  // Expect the form to have a submit button
  await expect(page.getByRole('button', { name: 'Create Room' })).toBeVisible();
});

test('should navigate to the about page', async ({ page, isMobile, baseURL }) => {
  // Start from the index page
  await page.goto(baseURL || 'http://localhost:3000/');
  // Expand menu by clicking on the hamburger menu for mobile devices
  if (isMobile) {
    await page.getByRole('button', { name: 'Open Menu' }).click();
  }
  // Create a locator for the "About" link
  const link = page.getByRole('menuitem', { name: 'About' });
  // Expect an attribute "to be strictly equal" to the value.
  await expect(link).toHaveAttribute('href', '/about/');
  // Click the "About" link
  await link.click();
  // Wait for navigation
  await page.waitForNavigation();
  // The new URL should end with "/about/"
  await expect(page).toHaveURL(/\/about\/$/);
  // The new page should contain a h1 with "Welcome"
  await expect(page.locator('h1')).toContainText('Welcome');
});

test('should navigate to the usage page', async ({ page, isMobile, baseURL }) => {
  // Start from the index page
  await page.goto(baseURL || 'http://localhost:3000/');
  // Expand menu by clicking on the hamburger menu for mobile devices
  if (isMobile) {
    await page.getByRole('button', { name: 'Open Menu' }).click();
  }
  // Create a locator for the "Usage" link
  const link = page.getByRole('menuitem', { name: 'Usage' });
  // Expect an attribute "to be strictly equal" to the value.
  await expect(link).toHaveAttribute('href', '/usages/');
  // Click the "Usage" link
  await link.click();
  // Wait for navigation
  await page.waitForNavigation();
  // The new URL should contain "/usages"
  await expect(page).toHaveURL(/\/usages/);
});

test('should navigate to the User Paste page', async ({ page, isMobile, baseURL }) => {
  // Start from the index page
  await page.goto(baseURL || 'http://localhost:3000/');
  // Expand menu by clicking on the hamburger menu for mobile devices
  if (isMobile) {
    await page.getByRole('button', { name: 'Open Menu' }).click();
  }
  // Hover the "Paste" link
  await page.getByRole('listitem').filter({ hasText: 'Paste' }).locator('a').first().hover();
  // Create a locator for the "User Paste" link
  const link = page.getByRole('menuitem', { name: 'user_paste' });
  // Expect an attribute "to be strictly equal" to the value.
  await expect(link).toHaveAttribute('href', '/pastes/public/');
  // Click the "User Paste" link
  await link.click();
  // Wait for navigation
  await page.waitForNavigation();
  // The new URL should contain "/pastes/public"
  await expect(page).toHaveURL(/\/pastes\/public/);
  // The new page should contain a cell with "Go Team Rotom"
  await expect(page.getByRole('cell', { name: 'Go Team Rotom!' })).toBeVisible();
});
