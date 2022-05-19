const dotenv=require("dotenv")

dotenv.config()
module.exports = {
  development: {
    dialect: "mysql",
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
  },
  test: {
    dialect: "mysql",
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
  },
  production: {
    dialect: "mysql",
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
  },
};
