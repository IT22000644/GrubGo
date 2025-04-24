import { createProxyMiddleware } from "http-proxy-middleware";
import config from "../config/index.js";

export const authProxy = createProxyMiddleware({
  target: config.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/auth": "",
  },
});
