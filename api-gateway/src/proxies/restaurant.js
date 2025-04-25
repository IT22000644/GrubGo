import { createProxyMiddleware } from "http-proxy-middleware";
import { RESTAURANT_SERVICE_URL } from "../config/index.js";

export const restaurantProxy = createProxyMiddleware({
  target: RESTAURANT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/restaurant": "",
  },
});
