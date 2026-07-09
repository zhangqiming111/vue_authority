import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:8088';

  return {
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({}),
  ],
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      util: fileURLToPath(new URL('./src/shims/util.js', import.meta.url)),
      '@antv/g6': fileURLToPath(new URL('./node_modules/@antv/g6/lib/index.js', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@antv/g6'],
  },
  server: {
    port: 8011,
    open: true,
    proxy: {
      '/echarts': {
        target: 'https://echarts.apache.org/examples',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/echarts/, ''),
      },
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/magicApi': {
        target: 'http://demo.mf999.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/magicApi/, ''),
      },
      '/admin-api': {
        target: 'http://192.168.110.221:48080/admin-api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin-api/, ''),
      },
    },
  },
  };
});
