const fs = require("fs");

module.exports = {
  development: {
    dialect: "mariadb",
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  test: {
    dialect: "mariadb",
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  production: {
    dialect: "mariadb",
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        ca: fs.readFileSync(__dirname + "/mysql-ca-main.crt"),
      },
    },
  },
};
