require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

//initializing express
const app = express();
const PORT = process.env.PORT || 8000;

//connecting to mongodb
const uri = process.env.DB_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => {
    console.log('error in connecting to db');
})
db.once('open', () => {
    console.log('Connected to db');
})

//using middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//calling routes
app.use('/api', require('./routes'));

app.get('/', (req,res) => {
    res.status(200).json({message:'Server is up'})
})

app.listen(PORT, () => {
    console.log(`Server listening to PORT: ${PORT}`);
})