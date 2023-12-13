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
const checkoutController = require('../controllers/orderController')
const orderController = require('../controllers/orderController')

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

user_route.post('/updateQuantity',cartController.updateQuantity);
user_route.get('/removeProduct',cartController.removeProduct);

//resend
user_route.post('/resendOtp', userController.verifyResendOtp);
user_route.get('/resendOtp', userController.resendOtp);

user_route.get('/forgot-password',userController.loadforgotPass)
user_route.post('/forgot-password',userController.forgotPass)

user_route.get('/resetPassword/:token',userController.loadResestPass);
user_route.post('/resetPassword',userController.resetPass)

//user-profile
user_route.get('/user',userController.loaduserProfile)
user_route.post('/add-billing-address', userController.addBillingAddress);
user_route.get('/editAddress',userController.loadeditAddress)
user_route.post('/editAddress',userController.editAddress)
user_route.post('/editUserDetails',userController.updateUserProfile)

//checkout
user_route.get('/checkOut',orderController.loadCheckOut);
user_route.post('/confirm-order', orderController.confirmOrder);
user_route.get('/success-page',orderController.loadSuccess)

user_route.get('/orderdetails',userController.orderdetails);
user_route.post('/updatedPayment',orderController.updatedPayment);
  

module.exports = user_route;

