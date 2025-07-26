require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  database:{
    uri: process.env.MONGO_URI
  }
}