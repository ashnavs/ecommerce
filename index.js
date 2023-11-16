const express = require('express');
const app = express();
const path = require('path')
const port = 3001;
const dotenv = require('dotenv')
dotenv.config()

 //for userRoute
const userRoute= require('./routes/userRoute');
app.use('/',userRoute)

//for adminRoute
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)

const mongoose = require('mongoose');
mongoose.connect(process.env.mongoo_connect)

app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`);
})