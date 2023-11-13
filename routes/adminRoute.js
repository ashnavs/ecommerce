// adminRoute.js

const express = require('express');
const admin_route = express();
const path = require('path');
const otpGenerator = require('otp-generator');
const session = require('express-session')

// Setting ejs
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

// Connecting the controller
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");

admin_route.get('/', adminController.adminLogin);
admin_route.post('/adminlogin', adminController.adminLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/userDetails', adminController.loaduserDetails);
admin_route.get('/blockuser', adminController.blockUser);

admin_route.get('/adminDashboard', adminController.loadDashboard);

admin_route.get('/category', categoryController.loadCategory);

admin_route.get('/addnewCategory',categoryController.loadaddCategory);
admin_route.post('/addnewCategory',categoryController.addCategory)
admin_route.get('/listcategory',categoryController.listCategory)

module.exports = admin_route;
