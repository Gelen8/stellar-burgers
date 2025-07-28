import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{ts,tsx,js,jsx}',
    baseUrl: 'http://localhost:4000'
  },
});
