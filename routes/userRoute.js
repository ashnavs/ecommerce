const express = require('express');
const user_route = express();
const path = require('path');
const otpGenerator = require('otp-generator');
const session = require('express-session')
const auth = require('../middleware/auth')




user_route.use(express.urlencoded({extended : true }))

//setting session
user_route.use(session({
    secret:'mysitesessionsecret',
    resave:false,
    saveUninitialized:true
}))

//setting ejs
user_route.set('view engine','ejs');
user_route.set('views','./views/users');

//conneccting the controller
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");

//api
user_route.get('/', userController.loadLandingHome);

user_route.get('/register',userController.loadRegister);
user_route.post('/register',userController.insertUser);

user_route.get('/otpverification',userController.loadOtpVerification);
user_route.post('/verify',userController.verifyOtp);

user_route.get('/landingHome',auth.isLogin,userController.loadLandingHome)

user_route.get('/login',userController.loadLogin)
user_route.post('/login',userController.verifyLogin)

// user_route.get('/',auth.isLogout,userController.loadLogout)

//SHOP
user_route.get('/products',userController.loadProduct)

//productdetail
user_route.get('/productDetails',userController.loadproductDetail)

module.exports = user_route;