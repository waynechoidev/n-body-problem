import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

const config = defineConfig({
  base: "/n-body-problem/",
  server: {
    port: 8888,
  },
  plugins: [glsl()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@external", replacement: "/external" },
    ],
  },
});

export default config;
