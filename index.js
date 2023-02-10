const connectToMongo = require('./db');
require('dotenv').config();
const express = require('express');
const cors = require('cors')

connectToMongo();
const app = express();
const port = process.env.PORT || 80;

// middlewares 
app.use(cors());
app.use(express.json())

// routes 
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/notes', require('./routes/notes'));
app.get('/',function(req,res) {
    res.status(200);
    res.send('Welcome to Cloud Note')
})

app.listen(port, () => {
    console.log(`app is running on http://localhost:${port}`)
})