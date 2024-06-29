const { defineConfig, devices } = require("@playwright/test");

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./tests",
  reporter: "list",
  timeout: 10000,
  use: {
    baseURL: "http://localhost:7800",
    trace: "off",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
