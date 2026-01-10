// @ts-nocheck
import { defineConfig } from 'astro/config';
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import react from '@astrojs/react';

// async function generateImagesJson({ dir }) {
//     const imagesDir = join(process.cwd(), "public/images");
//     const finalDir = join(process.cwd(), "public");

//     const result = {};

//     async function readDirRecursive(dirPath) {
//         const entries = await readdir(dirPath, { withFileTypes: true });
//         for (const entry of entries) {
//             const fullPath = join(dirPath, entry.name);
//             if (entry.isDirectory()) await readDirRecursive(fullPath);
//             else result[entry.name] = `/images/${entry.name}`;
//         }
//         return result;
//     }

//     const tree = await readDirRecursive(imagesDir);

//     await writeFile(
//         join(finalDir, "images.json"),
//         JSON.stringify(tree, null, 2),
//         "utf-8"
//     );

//     console.log("✅ images.json generated!");
// }

// function hook(name, type, func) {
//     const hooks = {};
//     hooks[type] = func;
//     return { name, hooks };
// }

// https://astro.build/config
export default defineConfig({
    integrations: [
        // hook("generate-images-json", "astro:config:setup", generateImagesJson),
        react(),
    ]
});


