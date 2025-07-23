/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  allowed_origins: process.env.ALLOWED_ORIGINS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  openai: {
    api_key: process.env.DEEPSEEK_API_KEY,
    base_url: process.env.DEEPSEEK_BASE_URL,
    moedel: process.env.DEEPSEEK_MODEL,
    site_name: process.env.DEEPSEEK_SITE_NAME,
    site_url: process.env.DEEPSEEK_SITE_URL,
  },
};
