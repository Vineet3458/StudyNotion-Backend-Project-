const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect ( process.env.MONGODB_URL, {
        useNewURLParser : true,
        useUnifiedTopology : true,
    })
    .then (() => console.log("DB connnected Successfully"))
    .catch ((error) => {
        console.log("DB connection failed");
        console.error*(error.message);
        process.exit(1);
    }) 
};