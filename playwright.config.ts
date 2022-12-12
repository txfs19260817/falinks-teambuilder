// eslint-disable-next-line import/no-extraneous-dependencies
import { devices, PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Timeout per test in milliseconds
  timeout: 60 * 1000,
  // Test directory
  testDir: path.join(__dirname, 'e2e'),
  // If a test fails, retry it additional once
  retries: 1,
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: 'test-results/',

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: [
    {
      command: 'npm run dev',
      url: baseURL,
      // Timeout for waiting until the server is listening on the port in milliseconds
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],

  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Retry a test if it's failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: 'retry-with-trace',

    // Use the en-US locale for all tests
    locale: 'en-US',

    // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
    // contextOptions: {
    //   ignoreHTTPSErrors: true,
    // },

    // Record video only when retrying a test for the first time
    video: 'on-first-retry',
  },

  projects: [
    // Test against Desktop Browsers
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    // {
    //   name: 'Desktop Safari',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },
    // Test against mobile viewports.
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 12'],
      timeout: 80 * 1000,
    },
  ],
};
export default config;
