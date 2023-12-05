const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { v4: uuidv4 } = require('uuid');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')


const loadCheckOut = async(req,res) => {
    try {
        const user = req.session.user_id;
        const address = await Address.find({user});
        const cart = await Cart.findOne({user}).populate('products.product')
        console.log(cart);

        res.render('checkOut' , { user , address , cart })
    } catch (error) {
        console.log(error.message);
    }
};

// ... (existing imports)

// async function confirmOrder(req, res) {
//     try {
//         // Extract order details from the request body
//         const { billingAddress, paymentMethod, products /* Add other necessary details */ } = req.body;

//         // Create a new order in the database
//         const newOrder = new Order({
//             user: req.session.user_id, // Assuming you have a user session
//             address: await Address.create(billingAddress),
//             products: products.map(product => ({
//                 product: product.productId,
//                 quantity: product.quantity,
//                 price: product.price,
//                 total: product.total,
//                 // Add other product details
//             })),
//             paymentMethod,
//             // Add other order details
//         });

//         const savedOrder = await newOrder.save();

//         // Update the cart or perform other necessary actions

//         // Send a response indicating success
//         res.json({ success: true, orderId: savedOrder._id });
//     } catch (error) {
//         // Handle errors and send an error response
//         console.error('Error confirming order:', error);
//         res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// }

const confirmOrder = async(req,res)=>{
        console.log("jsfhbsdfhvfjidkvffsvn snmzd vnmzs");
    try {
  
        console.log(req.body);
       const userId = req.session.user_id;
       const addressId = req.body.addressId;
       const paymentMethod = req.body.PaymentMethod;
       
       console.log(addressId,paymentMethod);
       
       const cart = await Cart.findOne({user:userId}).populate('products.product')
      
  
       const order = {
        user : req.session.user_id,
        address : addressId,
        paymentMethod: paymentMethod,
        products: cart.products.map((item)=> {
          return{
            product: item.product,
            quantity: item.quantity,
            price: item.product.price,
            total: item.subTotal,
            
          }
        }),
        grandTotal: cart.total
       }
       
        await Order.insertMany(order);
  
        // for (const item of cart.products) {
        //   const product = item.product;
          
        //   const updatedQuantity = product.quantity - item.quantity;
        //   const updatedOrders = product.orders + item.quantity;

        //   console.log(updatedOrders);
        //   console.log("//////////" +product.product);
        //   await productModel.findByIdAndUpdate(product._id, { quantity: updatedQuantity , orders:updatedOrders});
        // }
          await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });
          res.status(200).json({message:"success"});
          
  
        } catch (error) {
          console.log(error);
        }
  }


const loadSuccess = async(req,res)=>{
    try {
        const user = req.session.user_id;
        res.render('successPage' , {user})
    } catch (error) {
        console.log(error.message);
    }
};

const loadOrderList = async (req,res) => {
  try {
      const order = await Order.find().populate('address')
      res.render('orderList',{order});
  } catch (error) {
      console.log(error.message);
  }
};

const loadOrderDetails = async(req,res) => {
  try {
    const orderId = req.query.orderId;
    const orderDetails = await Order.findById(orderId).populate('address').populate('products.product');
    res.render('orderDetails' , {orderDetails})
  } catch (error) {
    console.log(error.message);
  }
};

const orderStatus = async (req,res)=>{
  try {
    const {orderId,status} = req.body;
    console.log("/?/?????//////"+orderId,status);

    if(!status || !orderId){
      return res.status(400).json({ error: 'Invalid input parameters' });
    }
    const updateOrder = await Order.findById(
      {_id:orderId},
      {$set:{status:status}},
      {new:true}
    );
    console.log(updateOrder);

    if(!updateOrder){
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}


  
module.exports = {
    loadCheckOut,
    confirmOrder,
    loadSuccess,
    loadOrderList,
    loadOrderDetails,
    orderStatus
}