const express = require('express');
const user_route = express();
const path = require('path');
const otpGenerator = require('otp-generator');
const session = require('express-session')
const auth = require('../middleware/auth')
const bodyParser = require('body-parser');





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
user_route.get('/logout',auth.isUserBlockedAndLoggedIn,userController.loadLogout)



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

user_route.get('/cart',auth.isUserBlockedAndLoggedIn, cartController.addToCart);
user_route.get('/cartPage',auth.isUserBlockedAndLoggedIn,cartController.loadCart)

user_route.post('/updateQuantity',auth.isUserBlockedAndLoggedIn,cartController.updateQuantity);
user_route.get('/removeProduct',auth.isUserBlockedAndLoggedIn,cartController.removeProduct);

//resend
user_route.post('/resendOtp', userController.verifyResendOtp);
user_route.get('/resendOtp', userController.resendOtp);

user_route.get('/forgot-password',userController.loadforgotPass)
user_route.post('/forgot-password',userController.forgotPass)

user_route.get('/resetPassword/:token',userController.loadResestPass);
user_route.post('/resetPassword',userController.resetPass)

//user-profile
user_route.get('/user',auth.isUserBlockedAndLoggedIn,userController.loaduserProfile)
user_route.post('/add-billing-address',auth.isUserBlockedAndLoggedIn, userController.addBillingAddress);
user_route.get('/editAddress',auth.isUserBlockedAndLoggedIn,userController.loadeditAddress)
user_route.post('/editAddress',auth.isUserBlockedAndLoggedIn,userController.editAddress)
user_route.post('/editUserDetails',auth.isUserBlockedAndLoggedIn,userController.updateUserProfile)

//checkout
user_route.get('/checkOut',auth.isUserBlockedAndLoggedIn,orderController.loadCheckOut);
user_route.post('/confirm-order',auth.isUserBlockedAndLoggedIn, orderController.confirmOrder);
user_route.get('/success-page',auth.isUserBlockedAndLoggedIn,orderController.loadSuccess)

user_route.get('/orderdetails',auth.isUserBlockedAndLoggedIn,userController.orderdetails);
user_route.post('/updatedPayment',auth.isUserBlockedAndLoggedIn,orderController.updatedPayment);
user_route.post('/cancelOrder',auth.isUserBlockedAndLoggedIn,orderController.cancelOrder);

//404page
user_route.get('/error',userController.loadError)

//coupon
user_route.post('/applyCoupon',auth.isUserBlockedAndLoggedIn,orderController.applyCoupon)
user_route.get('/removeCoupon',orderController.removeCoupon)
  

module.exports = user_route;

