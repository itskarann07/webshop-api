const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
        }).then(()=>console.log('Mongodb Connected'))
        .catch(err=>console.log(err));
    }
    catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;