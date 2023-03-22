import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import federation from "@originjs/vite-plugin-federation";
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext'
  },
  plugins: [
    react(),
    federation({
      name: 'dashboard-app',
      remotes: {
        "remote-header": {
          external: `new Promise((resolve) => { resolve(window.remoteHeader) }).then((m) => m)`,
          externalType: 'promise',
        },
      },
      shared: {
        react: {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies.react,
        },
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react-dom'],
        },
        'react-router-dom': {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react-router-dom'],
        },
        '@chakra-ui/react': {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['@chakra-ui/react'],
        },
      },
    })
  ],
  resolve: {
    alias: {
      lib: resolve(__dirname, "src/lib"),
      routes: resolve(__dirname, "src/routes"),
    },
  },
});
