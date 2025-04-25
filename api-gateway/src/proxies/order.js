import { createProxyMiddleware } from "http-proxy-middleware";
import { ORDER_SERVICE_URL } from "../config/index.js";

export const orderProxy = createProxyMiddleware({
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/order": "",
  },
});
