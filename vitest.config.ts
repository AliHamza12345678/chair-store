import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./scripts/setup-tests.ts",
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
    exclude: [
      "**/node_modules/**", 
      "**/dist/**", 
      "**/cypress/**", 
      "**/.{idea,git,cache,output,temp}/**", 
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*", 
      "tests/**"
    ],
  },
})
