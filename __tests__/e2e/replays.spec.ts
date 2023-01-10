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
  await page.getByText('Dondozo').click();
  await page.getByPlaceholder('Pokémon ...').fill('pa');
  await page.getByText('Pawmot').click();
  await page.getByPlaceholder('Pokémon ...').fill('tal');
  await page.getByText('Talonflame').click();
  await page.getByText('Created At⇵').click();
  await expect(
    page
      .getByRole('row', {
        name: '🔗 1543 Animod1 Annihilape Gastrodon Grimmsnarl Meowscarada Sylveon Volcarona ButterK Arcanine Dondozo Gholdengo Pawmot Talonflame Tatsugiri 12/28/2022',
      })
      .getByRole('cell', { name: 'Animod1' })
  ).toBeVisible();
  await expect(
    page
      .getByRole('cell', {
        name: 'Arcanine Dondozo Gholdengo Pawmot Talonflame Tatsugiri',
      })
      .getByRole('img', { name: 'Pawmot' })
  ).toBeVisible();
});

test('should find related replays in Paste page', async ({ page, baseURL }) => {
  // Start from Penguin's December Ladder 1st Place Team page
  await page.goto(baseURL ? `${baseURL}/pastes/clcjr2ugq000wsgoy1utfb2ud/` : 'http://localhost:3000/pastes/clcjr2ugq000wsgoy1utfb2ud/');
  await page.waitForNavigation();

  // Switch to Replay tab
  await page.getByRole('tab', { name: 'Replays' }).click();
  // Sort by Created At
  await page.getByText('Created At⇵').click();
  await expect(
    page
      .getByRole('row', {
        name: '🔗 1561 ashzera 979 936 635 876 198 700 Heliosan Baxcalibur Dondozo Gholdengo Meowscarada Tatsugiri Volcarona 1/5/2023',
      })
      .getByRole('img', { name: 'Baxcalibur' })
  ).toBeVisible();
});
