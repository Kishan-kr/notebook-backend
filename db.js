const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.DATABASE || "mongodb://localhost:27017/kishan";

const connectToMongo = () => {
    mongoose.connect(mongoURI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("connected to Mongo successfully");
    });
}

module.exports = connectToMongo;