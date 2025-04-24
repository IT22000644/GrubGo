import { config } from "dotenv";

config();

export const { RESTAURANT_SERVICE_URL, MONGODB_URI } = process.env;
