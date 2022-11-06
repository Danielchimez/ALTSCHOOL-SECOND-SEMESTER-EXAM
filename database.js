const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI


function connectToMongoDB(){
    mongoose.connect(MONGODB_URI);

    mongoose.connection.on('connected', () => {
        console.log('Connected to MONGO_DB successfully')
    });

    mongoose.connection.on('error', (err) => {
        console.log('MongoDB connection failed')
    });
}


module.exports = {connectToMongoDB} 