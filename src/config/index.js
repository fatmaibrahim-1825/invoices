require("dotenv").config();

module.exports = {
  SECRET: process.env.SECRET,
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  BASE_PATH: process.env.BASE_PATH,
  SWAGGER_URL: process.env.SWAGGER_URL,
  EXPIRES_IN: process.env.EXPIRES_IN,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  REGION: process.env.REGION,
  BUCKET_PATH: process.env.BUCKET_PATH,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
