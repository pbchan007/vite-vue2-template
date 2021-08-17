import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { createVuePlugin } from "vite-plugin-vue2";
// vue3
import vue from "@vitejs/plugin-vue";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin({}),
    legacy({
      targets: ["ie 11"],
    }),
  ],
  resolve: {
    alias: {
      // 键必须以斜线开始和结束
      "/@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    // 是否自动在浏览器打开
    open: false,
    // 是否开启 https
    https: false,
    // 服务端渲染
    proxy: {
      // 如果是 /api 打头，则访问地址如下
      "/apis": {
        target: "https://baidu.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apis/, ""),
      },
    },
  },
  // 引入第三方的配置
  optimizeDeps: {
    include: ["axios", "dayjs"],
  },
});
