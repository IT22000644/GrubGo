import { createProxyMiddleware } from "http-proxy-middleware";
import { AUTH_SERVICE_URL } from "../config/index.js";

export const authProxy = createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/auth": "",
  },
});
