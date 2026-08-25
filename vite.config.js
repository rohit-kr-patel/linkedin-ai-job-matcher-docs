import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Chrome extensions load files from disk, so all asset paths must be
// relative ("./") rather than absolute ("/"). Output goes to dist/,
// which is the folder you load as an unpacked extension.
export default defineConfig({
    plugins: [react()],
    base: "./",
    build: {
        outDir: "dist",
        emptyOutDir: true,
    },
});
