import { expect, test } from '@playwright/test';

import { AppConfig } from '@/utils/AppConfig';

test('should navigate to the zh-Hans home page', async ({ page, baseURL }) => {
  // Go to the index page (the baseURL is set via the webServer in the playwright.config.ts)
  const zhHansURL = `${baseURL}/zh-Hans/` || 'http://localhost:3000/zh-Hans/';
  await page.goto(zhHansURL);
  // Expect to have h1 with the app name
  await expect(page.locator('h1')).toHaveText(AppConfig.title);
  // Expect its next sibling to be a <p> with the app slogan in Chinese
  await expect(page.locator('h1 + p')).toHaveText('以群体智慧构建下一支强劲的队伍');
});
