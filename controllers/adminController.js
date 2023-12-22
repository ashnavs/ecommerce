const Admin = require('../models/adminModel')
const User = require('../models/userModel')
//const orderModel = require('../models/orderModel')
//const productModel = require('../models/productModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
// const { loadLogin } = require('./userController')
const mongoosePaginate = require('mongoose-paginate-v2');
const Order = require('../models/orderModel') 
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel');




const adminLogin = async (req, res) => {
    try {
        res.render('adminlogin')
    } catch (error) {
        console.log(error.message);
    }
}
const verifyLogin = async (req, res) => {
    try {
        const {email,password} = req.body;
      
        const adminData = await Admin.findOne({ email: email })
      


        if (adminData) {

            if (adminData.password === password) {
                req.session.admin_id = adminData._id
                res.redirect('/admin/adminDashboard')

            }
            else {
               
                res.redirect('/adminlogin')
            }

        }
        else {
            res.redirect('/adminlogin');
         
        }


    } catch (error) {
        console.log(error.message)
        res.redirect('/adminlogin')
    }

}

const loadDashboard = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.product');
        const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
        const totalSales = orders.length;
        const totalProductsSold = orders.reduce((sum, order) => sum + order.products.length, 0);

        const uniqueProducts = new Set();
        orders.forEach(order => {
            order.products.forEach(product => {
                if (product.product && product.product._id) {
                    uniqueProducts.add(product.product._id.toString());
                }
            });
        });
        const totalUniqueProducts = uniqueProducts.size;
        const totalUsers = await User.countDocuments();

        const productSalesMap = new Map();
        orders.forEach(order => {
            order.products.forEach(product => {
                const productId = product.product && product.product._id ? product.product._id.toString() : null;
                const quantity = product.quantity;
                if (productId) {
                    if (productSalesMap.has(productId)) {
                        productSalesMap.set(productId, productSalesMap.get(productId) + quantity);
                    } else {
                        productSalesMap.set(productId, quantity);
                    }
                }
            });
        });

        const topSellingProducts = await Promise.all(
            [...productSalesMap.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(async ([productId, quantitySold]) => {
                    const product = await Product.findById(productId).exec();
                    if (product) {
                        return {
                            name: product.name,
                            date: new Date(product.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            }),
                            discountPrice: product.discountPrice,
                            quantitySold: quantitySold,
                            stock: product.quantity, // Assuming product quantity is the stock
                            amount: product.discountPrice * quantitySold,
                            image: product.productImage[0],
                        };
                    } else {
                        return null; // Handle the case where product is not found
                    }
                })
        );

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })  // Sorting by createdAt in descending order
            .limit(5)  // Limiting to the last 5 orders
            .populate('products.product');

        const razorpayTotal = await Order.aggregate([
            { $match: { paymentMethod: 'RazorPay', status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]);

        const codTotal = await Order.aggregate([
            { $match: { paymentMethod: 'Cash On Delivery', status: 'Delivered' } },
            { $group: { _id: null, total: { $sum: '$grandTotal' } } }
        ]);
        res.render('adminDashboard', {
            totalRevenue,
            totalSales,
            totalProductsSold,
            totalUniqueProducts,
            totalUsers,
            topSellingProducts,
            recentOrders,
            razorpayTotal,
            codTotal
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};


// const loadDashboard = async (req, res) => {
//     try {
//         const orders = await Order.find().populate('products.product');
//         const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
//         const totalSales = orders.length;
//         const totalProductsSold = orders.reduce((sum, order) => sum + order.products.length, 0);

//         const uniqueProducts = new Set();
//         orders.forEach(order => {
//             order.products.forEach(product => {
//                 uniqueProducts.add(product.product._id.toString());
//             });
//         });
//         const totalUniqueProducts = uniqueProducts.size;

//         const productSalesMap = new Map();
//         orders.forEach(order => {
//             order.products.forEach(product => {
//                 const productId = product.product._id.toString();
//                 const quantity = product.quantity;
//                 if (productSalesMap.has(productId)) {
//                     productSalesMap.set(productId, productSalesMap.get(productId) + quantity);
//                 } else {
//                     productSalesMap.set(productId, quantity);
//                 }
//             });
//         });

//     const topSellingProducts = await Promise.all(
//         [...productSalesMap.entries()]
//             .sort((a, b) => b[1] - a[1])
//             .slice(0, 3)
//             .map(async ([productId, quantitySold]) => {
//                 const product = await Product.findById(productId).exec();
//                 return {
//                     title: product.title,
//                     date: new Date(product.createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric',
//                     }),
//                     sales_price: product.sales_price,
//                     quantitySold: quantitySold,
//                     stock: product.quantity, // Assuming product quantity is the stock
//                     amount: product.sales_price * quantitySold,
//                 };
//             })
//         );


//         const razorpayTotalResult = await Order.aggregate([
//             { $match: { paymentMethod: 'Razorpay', status: 'Delivered' } },
//             { $group: { _id: null, total: { $sum: '$grandTotal' } } }
//         ]);
        
//         const codTotalResult = await Order.aggregate([
//             { $match: { paymentMethod: 'Cash On Delivery', status: 'Delivered' } },
//             { $group: { _id: null, total: { $sum: '$grandTotal' } } }
//         ]);
        
//         // Handle the case where the aggregation result is null or empty
//         const razorpayTotalAmount = razorpayTotalResult.length > 0 ? razorpayTotalResult[0].total : 0;
//         const codTotalAmount = codTotalResult.length > 0 ? codTotalResult[0].total : 0;


//         const recentOrders = await Order.find()
//             .sort({ createdAt: -1 })  // Sorting by createdAt in descending order
//             .limit(5)  // Limiting to the last 5 orders
//             .populate('products.product');

//         const totalUsers = await User.countDocuments();

//         res.render('adminDashboard', {
//             totalRevenue,
//             totalSales,
//             totalProductsSold,
//             totalUniqueProducts,
//             topSellingProducts,
//             totalUsers,
//             recentOrders,
//             razorpayTotal: razorpayTotalAmount,
//             codTotal: codTotalAmount
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send('Internal Server Error');
//     }
// };




const loaduserDetails = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 7;
        const filterBy = req.query.filterBy; // Retrieve the filter parameter from the query string

        let query = {};

        // Adjust the query based on the selected filter
        if (filterBy === 'blocked') {
            query = { is_blocked: true };
        } else if (filterBy === 'unblocked') {
            query = { is_blocked: false };
        }

        const totalCount = await User.countDocuments(query);
        const totalPages = Math.ceil(totalCount / perPage);

        const users = await User.find(query)
            .sort({ name: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ name: 1 });

        res.render('userDetails', { users, currentPage: page, totalPages, filterBy });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
};










const blockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found!");
        }
        user.is_blocked = !user.is_blocked;
        await user.save();
        res.redirect('/admin/userDetails')
    } catch (error) {
        console.log(error.message);
    }
};

// const blockUser = async (req, res) => {
//     try {
//         const id = req.query.id;
//         const user = await User.findById(id);

//         if (!user) {
//             console.log("User not found!");
//             return res.redirect('/admin/userDetails');
//         }

//         user.is_blocked = !user.is_blocked;
//         await user.save();
//         res.redirect('/admin/userDetails');
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send('Internal Server Error');
//     }
// };




const loadCrop = async(req,res)=>{
    try {
        res.render('crop')
    } catch (error) {
        console.log(error.message);
    }
}

const getSalesReport=async(req,res)=>{
    try{
        const admin=req.session.adminData

        const page=parseInt(req.query.page) || 1;
        const perPage=10;


        let query={status:"payment successfull"};
        
        if (req.query.paymentMethod) {
            if (req.query.paymentMethod === "Online Payment") {
              query.paymentMethod = "Online Payment";
            } else if (req.query.paymentMethod === "Cash On Delivery") {
              query.paymentMethod = "Cash on delivery";
            }
      
          }

        if (req.query.status) {
            if (req.query.status === "Daily") {
              query.orderDate = dateUtils.getDailyDateRange();
            } else if (req.query.status === "Weekly") {
              query.orderDate = dateUtils.getWeeklyDateRange();
            } else if (req.query.status === "Yearly") {
              query.orderDate = dateUtils.getYearlyDateRange();
            }
          }
        if(req.query.status){
            if(req.query.status=== "Daily"){
                query.orderDate=dateUtils.getDailyDateRange();

            }
            
                else if(req.query.status==="Weekly"){
                    query.orderDate=dateUtils.getWeeklyDateRange();

                }
            
            else if(req.query.status === "Yearly")
            {
                query.orderDate= dateUtils.getYearlyDateRange();
            }
        }
        if(req.query.startDate && req.query.endDate){
            query.orderDate={
                $gte:new Date(req.query.startDate),
                $lte:new Date(req.query.endDate),
            };
        }
      
        const totalOrdersCount = await Order.countDocuments(query);
        const totalPages=Math.ceil(totalOrdersCount/perPage);
        const skip=(page-1) * perPage;

        const orders = await Order.find(query)
      .populate("user")
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(perPage);


  


        const totalRevenue=orders.reduce((acc,order)=>acc + order.totalAmount,0);

        const returnedOrders = orders.filter(order => order.status === "Return confirmed");


console.log("Count of orders with 'Return Confirmed' status:", );


        const totalSales=orders.length;


        const totalProductSold=orders.reduce((acc,order)=>acc + order.items.length,0);

        res.render("report",{
            orders,admin,totalRevenue,returnedOrders,totalSales,totalProductSold,req,totalPages,currentPage:page});
      


    }catch(error){
        console.log(error.message);
    }
}


const loadAddCoupon = async(req,res)=>{
    try {
       
        res.render('addCoupon')
    } catch (error) {
        console.log(error.message);
    }
}

// const addCoupon = async(req,res)=>{
//     try {
//         const {  name, code, discountAmount, expireDate, minimumCartTotal} = req.body;

//         const coupon = {
//             name:name,
//             CouponCode:code,
//             expiry:expireDate,
//             discount:discountAmount,
//             minimumCartTotal:minimumCartTotal
//         }

//         const couponDetails = await Coupon.insertMany( coupon);

//         console.log(couponDetails);
//         res.redirect('/admin/addCoupon')
//     } catch (error) {
//         console.log(error.message);
//     }
// }
const addCoupon = async (req, res) => {
    try {
      const { name, code, discountAmount, expireDate, minimumCartTotal } = req.body;
  
      const coupon = {
        name: name,
        CouponCode: code,
        expiry: expireDate,
        discount: discountAmount,
        minimumCartTotal: minimumCartTotal
      };
  
      const couponDetails = await Coupon.insertMany(coupon);
  
      console.log(couponDetails);
      res.redirect('/admin/addCoupon');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  };

  
const loadListCoupon = async(req,res)=>{
    try {
        const coupons = await Coupon.find();
        res.render('couponList',{coupons})
        console.log(coupons);
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    adminLogin,
    loadDashboard,
    verifyLogin,
    loaduserDetails,
    blockUser,
    loadCrop,
    loadAddCoupon,
    addCoupon,
    loadListCoupon
}