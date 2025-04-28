import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/index.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, body }) => {
  const info = await transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject,
    text: body,
  });

  console.log("Email sent:", info.messageId);
};
