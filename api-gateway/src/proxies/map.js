import { createProxyMiddleware } from "http-proxy-middleware";
import { MAP_SERVICE_URL } from "../config/index.js";

export const mapProxy = createProxyMiddleware({
  target: MAP_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/map": "",
  },
});
