import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

/**
 * Emit pre-compressed `.gz` + `.br` siblings for every JS/CSS/HTML asset
 * over the threshold. A static host (nginx `gzip_static` / `brotli_static`,
 * Apache, CDN) can then serve them directly instead of compressing on the
 * fly — noticeably faster first render on slow networks.
 */
function precompress(threshold = 10240): Plugin {
  const filter = /\.(js|mjs|cjs|css|html|json|svg)$/i;
  return {
    name: "precompress-gzip-brotli",
    apply: "build",
    closeBundle() {
      const walk = (dir: string): void => {
        for (const entry of readdirSync(dir)) {
          const file = join(dir, entry);
          if (statSync(file).isDirectory()) {
            walk(file);
            continue;
          }
          if (!filter.test(file) || statSync(file).size < threshold) continue;
          const buf = readFileSync(file);
          writeFileSync(`${file}.gz`, gzipSync(buf, { level: 9 }));
          writeFileSync(
            `${file}.br`,
            brotliCompressSync(buf, {
              params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
            })
          );
        }
      };
      walk("dist");
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] }), precompress()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    reportCompressedSize: true,
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // Split heavy vendors out of the entry chunk so the first paint
        // downloads less JS and repeat visits hit the browser cache.
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/(react|react-dom|react-router-dom)/,
            },
            {
              name: "ui-vendor",
              test: /node_modules\/(@radix-ui|lucide-react|framer-motion|react-icons)/,
            },
            {
              name: "data-vendor",
              test: /node_modules\/(@tanstack|axios)/,
            },
          ],
        },
      },
    },
  },
});
