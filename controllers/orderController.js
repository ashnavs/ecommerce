const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { v4: uuidv4 } = require('uuid');
const Address = require('../models/addressModel');
const Cart = require('../models/cartModel')
const Order = require('../models/orderModel')
const Razorpay = require('razorpay')
const transactionModel = require('../models/transactionModel')




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

// const craeteRazorpayOrder = async(amount)=>{
// try{
//   const razorpay = new Razorpay({
//     key_id: process.env.razorpay_key_id,
//     key_secret: process.env.razorpay_key_secret

//   });

//   const options = {
//     amount: amount*100,
//     currency:'INR',
//     receipt:'order_receipt_' + Date.now(), t,
//     payment_capture:1

//    };

//    const order = await razorpay.orders.create(options);
//    return order;
// }
// catch(error){
//   console.log(error.message);
// }
 
  
// }

// const confirmOrder = async (req, res) => {
//   try {

//     const userId = req.session.user_id;
//     const addressId = req.body.addressId;
//     const paymentMethod = req.body.PaymentMethod;

//     console.log(addressId, paymentMethod);

//     const cart = await Cart.findOne({ user: userId }).populate('products.product');

    


//     for (const item of cart.products) {
//       const product = item.product;
//       const requestedQuantity = item.quantity;

//       if (requestedQuantity > product.quantity) {``
//         const message = `Stock for '${product.name}' is insufficient. Available stock: ${product.quantity}`;
//         return res.status(400).json({ message });
//       }
//     }

//     const order = {
//       user: req.session.user_id,
//       address: addressId,
//       paymentMethod: paymentMethod,
//       products: cart.products.map((item) => {
//         return {
//           product: item.product,
//           quantity: item.quantity,
//           price: item.product.price,
//           total: item.subTotal,
//         };
//       }),
//       grandTotal: cart.total,
//     };

//     await Order.insertMany(order);

//     // Update product stock after successful order
//     for (const item of cart.products) {
//       const product = item.product;
//       const updatedQuantity = product.quantity - item.quantity;
//       const updatedOrders = product.orders + item.quantity; // Increment orders field

//       console.log(updatedOrders);
//       console.log("//////////" + product.product);
//       await Product.findByIdAndUpdate(product._id, { quantity: updatedQuantity, orders: updatedOrders });
//     }

//     await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });
//     res.status(200).json({ message: "success" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


const createRazorpayOrder = async (amount) => {
  try{
    const razorpay = new Razorpay({
      key_id: process.env.razorpay_key_id,
      key_secret: process.env.razorpay_key_secret
  
    });
    
    const options = {
      amount: amount*100,
      currency:'INR',
      receipt:'order_receipt_' + Date.now(), 
      payment_capture:1
  
     };
  
     const order = await razorpay.orders.create(options);
     return order;

  }
  catch(error){
    console.log(error.message);
  }
   
};



// const confirmOrder = async (req, res) => {
//   try {

//     const userId = req.session.user_id;
//     const addressId = req.body.addressId;
//     const paymentMethod = req.body.PaymentMethod;

//     console.log(addressId, paymentMethod);

//     const cart = await Cart.findOne({ user: userId }).populate('products.product');

    


//     for (const item of cart.products) {
//       const product = item.product;
//       const requestedQuantity = item.quantity;

//       if (requestedQuantity > product.quantity) {``
//         const message = `Stock for '${product.name}' is insufficient. Available stock: ${product.quantity}`;
//         return res.status(400).json({ message });
//       }
//     }

//     const order = {
//       user: req.session.user_id,
//       address: addressId,
//       paymentMethod: paymentMethod,
//       products: cart.products.map((item) => {
//         return {
//           product: item.product,
//           quantity: item.quantity,
//           price: item.product.price,
//           total: item.subTotal,
//         };
//       }),
//       grandTotal: cart.total,
//     };

//     await Order.insertMany(order);

//     // Update product stock after successful order
//     for (const item of cart.products) {
//       const product = item.product;
//       const updatedQuantity = product.quantity - item.quantity;
//       const updatedOrders = product.orders + item.quantity; // Increment orders field

//       console.log(updatedOrders);
//       console.log("//////////" + product.product);
//       await Product.findByIdAndUpdate(product._id, { quantity: updatedQuantity, orders: updatedOrders });
//     }

//     await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });
//     res.status(200).json({ message: "success" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };



const confirmOrder = async (req, res) => {
  try {

    const userId = req.session.user_id;
    const addressId = req.body.addressId;
    const paymentMethod = req.body.PaymentMethod;

    console.log(addressId, paymentMethod);

    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    if (paymentMethod === "Cash On Delivery" ) {

      for (const item of cart.products) {
        const product = item.product;
        const requestedQuantity = item.quantity;
  
        if (requestedQuantity > product.quantity) {``
          const message = `Stock for '${product.name}' is insufficient. Available stock: ${product.quantity}`;
          return res.status(400).json({ message });
        }
      }
  
      const order = {
        user: req.session.user_id,
        address: addressId,
        paymentMethod: paymentMethod,
        products: cart.products.map((item) => {
          return {
            product: item.product,
            quantity: item.quantity,
            price: item.product.price,
            total: item.subTotal,
          };
        }),
        grandTotal: cart.total,
      };
  
      await Order.insertMany(order);
  
      // Update product stock after successful order
      for (const item of cart.products) {
        const product = item.product;
        const updatedQuantity = product.quantity - item.quantity;
        const updatedOrders = product.orders + item.quantity; // Increment orders field
  
        console.log(updatedOrders);
        console.log("//////////" + product.product);
        await Product.findByIdAndUpdate(product._id, { quantity: updatedQuantity, orders: updatedOrders });
      }
  
      await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], total: 0 } });
      res.status(200).json({ message: "success" });

    }else if(paymentMethod === "Razorpay" ){

      // for checking the product quantity
      for (const item of cart.products) {
        const product = item.product;
        const requestedQuantity = item.quantity;
  
        if (requestedQuantity > product.quantity) {``
          const message = `Stock for '${product.name}' is insufficient. Available stock: ${product.quantity}`;
          return res.status(400).json({ message });
        }
      }
      try {
        const rezorpayOrder = await createRazorpayOrder(cart.total);
        res.status(201).json({
          message:"success",
          orderId: rezorpayOrder.id,
          amount:rezorpayOrder.amount,
          currency:rezorpayOrder.currency       
        })
        
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('No payment method choosed');
    }


    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const updatedPayment = async (req,res) => {
  try {
    const { paymentDetails, address} = req.body;
    let paymentMethod = 'RazorPay';
    console.log(paymentDetails);

    console.log(address);

        // Check if paymentMethod is provided
        if (!paymentMethod) {
          return res.status(400).json({ message: 'Payment method is required' });
        }

        const paymentId = paymentDetails.razorpay_payment_id;
        const orderId = paymentDetails.razorpay_order_id;
        const userId = req.session.user_id;
        

    const cart = await Cart.findOne({user:userId}).populate('products.product');

    const order = {
      user: userId,
      address: address,
      paymentMethod: paymentMethod,
      payment_Id: paymentId,
      order_Id: orderId,
      products: cart.products.map((item)=>{
        return{
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
          total: item.subTotal
        }
      }),
      grandTotal: cart.total
    }
     

    await Order.insertMany(order);

    const transfer ={
      user:userId,
      amount:paymentDetails.amount,
      paymentMethod:paymentMethod,
      type:'debited',
      orderId:orderId
    }

    console.log(transfer.amount);

    await transactionModel.insertMany(transfer);

    for (const item of cart.products) {
      const product = item.product;
      
      const updatedQuantity = product.quantity - item.quantity;
      const updatedOrders = product.orders + item.quantity;
      await Product.findByIdAndUpdate(product._id, { quantity: updatedQuantity , orders:updatedOrders});
    }
      await Cart.findOneAndUpdate({ user: userId }, { $set: { products: [], Total: 0 } });
      res.status(201).json({message:"success"});
  } catch (error) {
    console.log(error.message);
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
      const order = await Order.find().populate('address').sort({createdAt:-1});
      console.log(order);
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
    const updateOrder = await Order.findByIdAndUpdate(
      {_id:orderId},
      { $set: { status:status }},
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
    orderStatus,
    updatedPayment
}