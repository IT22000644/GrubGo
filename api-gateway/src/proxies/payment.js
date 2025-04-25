import { createProxyMiddleware } from "http-proxy-middleware";
import { PAYMENT_SERVICE_URL } from "../config/index.js";

export const paymentProxy = createProxyMiddleware({
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/payment": "",
  },
});
