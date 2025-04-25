import { createProxyMiddleware } from "http-proxy-middleware";
import { DELIVERY_SERVICE_URL } from "../config/index.js";

export const deliveryProxy = createProxyMiddleware({
  target: DELIVERY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/delivery": "",
  },
});
