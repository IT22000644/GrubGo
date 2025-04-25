import { createProxyMiddleware } from "http-proxy-middleware";
import { USER_SERVICE_URL } from "../config/index.js";

export const userProxy = createProxyMiddleware({
  target: USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/user": "",
  },
});
