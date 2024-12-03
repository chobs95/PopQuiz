import { defineConfig } from 'vite';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

export default defineConfig({
    define: {
        'process.env': process.env, // Pass environment variables to the client
    },
    build: {
        rollupOptions: {
        input: {
            popup: resolve(__dirname, 'popup.html'),
            background: resolve(__dirname, 'background.js'),
            content: resolve(__dirname, 'content.js'),
        },
        },
    },
    });