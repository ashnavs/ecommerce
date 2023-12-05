const express = require('express');
const app = express();
const path = require('path')
const port = 3001;
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const {  configureFlash } = require('./middleware/flash');

dotenv.config()
app.use(bodyParser.json());
 //for userRoute
const userRoute= require('./routes/userRoute');
app.use('/',userRoute)

// Use custom middleware

configureFlash(app);


//for adminRoute
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)

function connectDB(){
    mongoose.connect(process.env.mongoo_connect)
}

const mongoose = require('mongoose');
connectDB();

app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));


app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`);
})