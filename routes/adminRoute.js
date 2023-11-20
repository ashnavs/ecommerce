// adminRoute.js

const express = require('express');
const admin_route = express();
const path = require('path');
const otpGenerator = require('otp-generator');
const session = require('express-session')
const upload = require('../helper/multer')
const auth = require('../middleware/adminAuth')




// Setting ejs
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

// Connecting the controller
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");


admin_route.get('/', auth.isLogout,adminController.adminLogin);
admin_route.post('/adminlogin', adminController.adminLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/userDetails',auth.isLogin, adminController.loaduserDetails);
admin_route.get('/blockuser',auth.isLogin, adminController.blockUser);

admin_route.get('/adminDashboard',auth.isLogin, adminController.loadDashboard);

admin_route.get('/category',auth.isLogin, categoryController.loadCategory);

admin_route.get('/add-new-category',auth.isLogin,categoryController.loadaddCategory);

admin_route.post('/add-new-category',categoryController.addCategory)
admin_route.get('/listcategory',auth.isLogin,categoryController.listCategory)
admin_route.get('/edit-category',auth.isLogin,categoryController.editCategory)
admin_route.post('/edit-category',categoryController.updateCategory);



//product
admin_route.get('/products',auth.isLogin,productController.loadProduct);
admin_route.get('/addnewProduct',auth.isLogin,productController.loadaddnewProduct)
admin_route.post('/addnewProduct',upload.array('productImage'),productController.addnewProduct)
admin_route.get('/listProduct',productController.listProduct)
admin_route.get('/editProduct',productController.editProduct)
admin_route.post('/editProduct',upload.array('productImage'),productController.updateProduct)


module.exports = admin_route;
