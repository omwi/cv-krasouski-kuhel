import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/.next/**"],
    globals: true,
    api: {
      port: 3005,
    },
    server: {
      deps: {
        inline: ["next-i18next"],
      },
    },
  },
})
