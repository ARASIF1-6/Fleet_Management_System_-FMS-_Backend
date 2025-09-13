import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


// Nodemailer transporter setup
// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail service
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Additional options for Gmail
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;