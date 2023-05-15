import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    base: "./",
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    sourcemap: false,
    minify: "terser",
    plugins: [legacy({ targets: ["defaults", "not IE 11"] }), vue()],
});
