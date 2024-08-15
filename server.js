const express = require('express');
const app = express();
const connectDB = require('./src/models/database');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Define routes
app.use('/api', require('./src/routes/routes'));
// require('./src/routes/routes')
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log('Server is running on port 5000');
})