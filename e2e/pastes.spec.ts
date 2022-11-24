import { expect, test } from '@playwright/test';

test('should navigate to search page', async ({ page, baseURL }) => {
  // Start from the home page
  await page.goto(baseURL ? `${baseURL}/pastes/search/` : 'http://localhost:3000/pastes/search/');
  // The new URL should contain "pastes/search"
  await expect(page).toHaveURL(/pastes\/search/);
  // Perform a search
  await page.getByRole('button', { name: '+' }).click();
  await page.getByRole('listbox', { name: 'Pokemon Select 0' }).click();
  await page.getByRole('listbox', { name: 'Pokemon Select 0' }).press('Control+a');
  await page.getByRole('listbox', { name: 'Pokemon Select 0' }).fill('Volca');
  await page.getByRole('option', { name: 'Volcarona' }).click();
  // item
  await page.getByRole('listbox', { name: 'Item Select 0' }).click();
  await page.getByRole('listbox', { name: 'Item Select 0' }).press('Control+a');
  await page.getByRole('listbox', { name: 'Item Select 0' }).fill('Coba');
  await page.getByText('Coba Berry').click();
  // ability
  await page.getByRole('listbox', { name: 'Ability Select 0' }).selectOption('Flame Body');
  await page.getByText('hp').click();
  // moves
  await page.getByRole('listbox', { name: 'Move 1 Select 0' }).click();
  await page.getByRole('listbox', { name: 'Move 1 Select 0' }).fill('Rage');
  await page.getByText('Rage Powder').click();
  await page.getByRole('listbox', { name: 'Move 2 Select 0' }).click();
  await page.getByRole('listbox', { name: 'Move 2 Select 0' }).fill('Heat');
  await page.getByText('Heat Wave').click();
  await page.getByRole('spinbutton', { name: 'hp min 0' }).click();
  await page.getByRole('spinbutton', { name: 'hp min 0' }).press('Control+a');
  await page.getByRole('spinbutton', { name: 'hp min 0' }).fill('252');
  await page.getByRole('listbox', { name: 'Format Selector' }).selectOption('gen8vgc2022');
  // start search
  await page.getByRole('button', { name: 'Submit' }).click();
  // Wait for navigation
  await page.waitForTimeout(5 * 1000);
  await expect(page.getByText("MonoMalard's Kyurem-Black team")).toBeVisible();
});
