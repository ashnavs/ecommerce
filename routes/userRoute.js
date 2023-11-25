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

//connecting the controller
const userController = require("../controllers/userController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");

//api
user_route.get('/', userController.loadLandingHome);
user_route.get('/logout',auth.isLogin,userController.loadLogout)



user_route.get('/register',userController.loadRegister);
user_route.post('/register',userController.insertUser);

user_route.get('/otpverification',userController.loadOtpVerification);
user_route.post('/verify',userController.verifyOtp);

user_route.get('/landingHome',userController.loadLandingHome)

user_route.get('/login',userController.loadLogin)
user_route.post('/login',userController.verifyLogin)

// user_route.get('/',auth.isLogout,userController.loadLogout)

//products
user_route.get('/productsView',productController.loadProducts)

//productdetail
user_route.get('/productDetails',userController.loadproductDetail)

//cart

user_route.get('/cart',auth.isLogin, cartController.addToCart);
user_route.get('/cartPage',cartController.loadCart)


//user-profile
user_route.get('/user',userController.loaduserProfile)

//resend
user_route.post('/resendOtp', userController.verifyResendOtp);
user_route.get('/resendOtp', userController.resendOtp);



module.exports = user_route;

