import { expect, test } from '@playwright/test';

import { AppConfig } from '@/utils/AppConfig';

test('should navigate to the zh-Hans home page', async ({ page, baseURL }) => {
  // Go to the index page (the baseURL is set via the webServer in the playwright.config.ts)
  const zhHansURL = `${baseURL}/zh-Hans/` || 'http://localhost:3000/zh-Hans/';
  await page.goto(zhHansURL);
  // Expect to have h1 with the app name
  await expect(page.locator('h1')).toHaveText(AppConfig.title);
  // Expect its next sibling to be a <p> with the app slogan in Chinese
  await expect(page.locator('h1 + p')).toHaveText('以集体智慧构建下一支强劲的队伍');
});

test('should do cross-language team building', async ({ page, baseURL, browser, browserName }) => {
  // Start from the room page
  const currentRoomName = `${Date.now()}${browserName}`;
  const roomURL = baseURL ? `${baseURL}/room/${currentRoomName}` : `http://localhost:3000/room/${currentRoomName}`;
  await page.goto(roomURL);
  // Wait for navigation
  await page.waitForNavigation();
  // The new URL should contain currentRoomName
  await expect(page).toHaveURL(new RegExp(`/${currentRoomName}/`));
  await page.getByRole('tab', { name: 'Add new tab' }).click();
  // add a Pokémon on the first page
  const speciesName = 'Grimmsnarl';
  await page.getByPlaceholder('Pokémon').click();
  await page.getByPlaceholder('Pokémon').press('Control+a');
  await page.getByPlaceholder('Pokémon').fill(speciesName);
  await page.getByPlaceholder('Item').click();

  // Open another browser
  const context = await browser.newContext();
  const page2 = await context.newPage();
  // Go to the same room
  await page2.goto(roomURL);
  // Wait for navigation
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  // Expect to have the same room name
  await expect(page2).toHaveURL(new RegExp(`/${currentRoomName}/`));

  // Turn off toasts
  await page2.getByText('📜History').click();
  await page2.getByRole('switch', { name: 'Clear' }).check();
  await page2.getByText('✕').nth(1).click();

  // Expect to have the same Pokémon on the default (en) page
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesName}`);

  // Pikachu name in other languages
  const speciesNameMap = {
    'zh-Hans': '长毛巨魔',
    'zh-Hant': '長毛巨魔',
    ja: 'オーロンゲ',
    ko: '오롱털',
    fr: 'Angoliath',
    de: 'Olangaar',
    es: 'Grimmsnarl',
    it: 'Grimmsnarl',
  };
  // Change the locale to others
  // zh-Hans
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'zh-Hans' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/zh-Hans\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap['zh-Hans']}`);
  // zh-Hant
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'zh-Hant' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/zh-Hant\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap['zh-Hant']}`);
  // ja
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'ja' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/ja\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap.ja}`);
  // ko
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'ko' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/ko\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap.ko}`);
  // fr
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'fr' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/fr\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap.fr}`);
  // de
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'de' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/de\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap.de}`);
  // es
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'es' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/es\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap.es}`);
  // it
  await page2.getByRole('listbox', { name: 'Language Picker' }).selectOption({ value: 'it' });
  await page2.waitForNavigation({ waitUntil: 'networkidle' });
  await expect(page2).toHaveURL(/\/it\//);
  await expect(page2.getByRole('tab', { name: 'Tab 1' })).toHaveText(`1${speciesNameMap.it}`);
});
