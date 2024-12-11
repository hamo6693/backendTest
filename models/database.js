require("dotenv").config()
const { Sequelize } = require('sequelize');


const db = new Sequelize(process.env.DB_URL, process.env.DB_NAME,process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_NAME,
    logging:false
  });

  try {
      db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  module.exports = db