require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const Config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  DB_URL: process.env.DB_URL,
  API_PREFIX: process.env.API_PREFIX || "/api/v1/",
  JWT_SECRET: process.env.JWT_SECRET || "Naruto Uzumaki",
  PRODUCT_IMAGE:
    process.env.PRODUCT_IMAGE ||
    `http://localhost:${process.env.PORT}/products/`,
};

export default Config;
