const express = require('express');
const app = express();
const path = require('path')
const port = 3001;



 //for userRoute
const userRoute= require('./routes/userRoute');
app.use('/',userRoute)

//for adminRoute
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)

const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/lapkart_db")

app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`);
})