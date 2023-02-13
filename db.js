const mysql = require("mysql2");
const env = require("dotenv").config();

const connection = mysql.createConnection({
  host: env.parsed.HOST,
  user: env.parsed.USER,
  port: env.parsed.PORT,
  password: env.parsed.PASSWORD,
  database: env.parsed.DATABASE,
  multipleStatements: true,
});

module.exports = connection;
