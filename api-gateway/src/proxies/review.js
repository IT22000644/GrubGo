import { createProxyMiddleware } from "http-proxy-middleware";
import { REVIEW_SERVICE_URL } from "../config/index.js";

export const reviewProxy = createProxyMiddleware({
  target: REVIEW_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/review": "",
  },
});
