import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
const { resolve } = require("path");

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [vue()],
    resolve: {
        alias: {
            // "@": resolve(__dirname, "src"),
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
