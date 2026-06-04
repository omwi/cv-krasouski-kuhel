import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**", "**/.next/**"],
    coverage: {
      exclude: [
        "src/components/ui/**",
        "src/types/__generated__/**",
        "**/node_modules/**",
        "**/dist/**",
        "**/e2e/**",
        "**/.next/**",
        "vitest.config.ts",
        "vitest.setup.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
    },
    globals: true,
    server: {
      deps: {
        inline: ["next-i18next"],
      },
    },
  },
})
