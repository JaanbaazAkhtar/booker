require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 8000;

const uri = process.env.DB_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => {
    console.log('error in connecting to db');
})
db.once('open', () => {
    console.log('Connected to db');
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use('/api', require('./routes'));

app.get('/', (req,res) => {
    res.render('index.ejs', {title: 'Test Page'})
})

app.listen(PORT, () => {
    console.log(`Server listening to PORT: ${PORT}`);
})