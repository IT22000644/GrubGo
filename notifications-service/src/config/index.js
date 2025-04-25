import { config } from "dotenv";
import { NOTIFICATION_QUEUE } from "../../../auth-service/src/config";

config();

export const { NOTIFICATION_QUEUEk, EMAIL_USER, EMAIL_PASS } = process.env;
