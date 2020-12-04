import dotenv from 'dotenv';

dotenv.config();

export const COOKIE_NAME = "jid";
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const __production__ = (process.env.PRODUCTION === "production");
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;