//import the url key from env

require('dotenv').config()
const mongoUri = process.env.MONGODB

//use mongoose to send db key to mongoose to establish connection

const mongoose = require('mongoose')

const initializeDatabase = async () => {
     await mongoose.connect(mongoUri).then(() => {
          console.log("Connected to Database")
     }).catch(() => {
          console.log("Error in connecting to database")
     })
}

module.exports = {initializeDatabase}