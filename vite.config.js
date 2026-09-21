import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 讓打包後的資源使用相對路徑，
// 以便部署到 GitHub Pages 的任意子路徑（如 /repo-name/）都能正常載入。
export default defineConfig({
  plugins: [react()],
  base: './',
});
