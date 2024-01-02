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
const Coupon = require('../models/couponModel')




const loadCheckOut = async(req,res) => {
    try {
        const user = req.session.user_id;
        const address = await Address.find({user});
        const cart = await Cart.findOne({user}).populate('products.product')
        const coupon = await Coupon.find({minimumCartTotal: {$lte:cart.total}, status:true})
        console.log(cart);

        res.render('checkOut' , { user , address , cart , coupon})
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

// const cancelOrder = async(req,res)=>{
//   try {
//     const orderId = req.body.orderId;
//     let updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { status:'Cancelled'}}).populate('products.product');
//     const userData = await User.findById(req.session.user_id);
    
//     if(updatedOrder.paymentMethod === 'RazorPay'){
//       const walletUpdating = updatedOrder.grandTotal + userData.walletAmount;
//       userData.walletAmount = walletUpdating;
//       await userData.save();
//       console.log(userData+"userdataaaaaaaaaaaaaaaaaaaa");


//       const transfer = {
//         user:user_id,
//         amount:paymentDetails.amount,
//         paymentMethod:paymentMethod,
//         type:"credited",
//         orderId:orderId
//       }

//       await transactionModel.insertMany(transfer)
//     }

//     for(const item of updatedOrder.products){
//       const product = item.product;

//       const updatedQuantity = product.quantity + item.quantity;
//       const updatedOrders = product.orders - item.quantity;
//       await Product.findByIdAndUpdate(product._id, {quantity:updatedQuantity, orders:updatedOrders});
//     }

//     if(updatedOrder){
//       res.status(200).json({ success: false, message: 'Order not found or could not be cancelled' });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// }

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    let updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { status: 'Cancelled' } }).populate('products.product');
    const userData = await User.findById(req.session.user_id);

    if (updatedOrder.paymentMethod === 'RazorPay') {
      const walletUpdating = updatedOrder.grandTotal + userData.walletAmount;
      userData.walletAmount = walletUpdating;
      await userData.save();
      console.log(userData + "userdataaaaaaaaaaaaaaaaaaaa");

      const transfer = {
        user: req.session.user_id, // assuming user_id is stored in the session
        amount: updatedOrder.grandTotal,
        paymentMethod: 'RazorPay',
        type: "credited",
        orderId: orderId
      }

      await transactionModel.insertMany(transfer);
    }

    for (const item of updatedOrder.products) {
      const product = item.product;

      const updatedQuantity = product.quantity + item.quantity;
      const updatedOrders = product.orders - item.quantity;
      await Product.findByIdAndUpdate(product._id, { quantity: updatedQuantity, orders: updatedOrders });
    }

    // Corrected the condition to check if the order was updated successfully
    if (!updatedOrder) {
      res.status(200).json({ success: false, message: 'Order not found or could not be cancelled' });
    } else {
      res.status(200).json({ success: true, message: 'Order successfully cancelled' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}


const returnRequest = async(req,res)=>{
  try {
    const { orderId,reason} = req.body;
    const order = await Order.findByIdAndUpdate(orderId , { $set: { returnRequest:'requested' , reason:reason}});

    res.status(200).json({success:true, message: 'Return request submitted successfully'});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Failed to process the return request.' });
  }
}

const returnOrderList = async(req,res)=>{
  try {
    const returnedOrders = await Order.find({returnRequest:'requested'});
    res.render('returnOrder',{returnedOrders})
  } catch (error) {
    console.log(error.message);
  }
}

const returnOrderDetails = async(req,res)=>{
  try {
    const orderId = req.query.orderId;
    const order = await Order.findById(orderId).populate('address').populate('products.product')
    res.render('returnOrderDetails' , {order})
  } catch (error) {
    console.log(error.message);
  }
}

async function returnResponse(req, res) {
  try {


    const { status, orderId } = req.body;
    const updatedStatus = await Order.findByIdAndUpdate(orderId, { $set: { returnRequest: status } }).populate('products.product')
    const userData = await User.findOne({ _id: updatedStatus.user })
    console.log(userData);

    if (status === "accepted") {

      await Order.findByIdAndUpdate(orderId,{status:'Returned'})
      const walletUpdating = updatedStatus.grandTotal + userData.walletAmount;
      console.log("11111" + walletUpdating);
      userData.walletAmount = walletUpdating;
      await userData.save();
      console.log("222222" + userData);

      const transaction = {
        user: updatedStatus.user,
        amount: updatedStatus.grandTotal,
        paymentMethod: updatedStatus.paymentMethod,
        type: 'Credited'
      }
      await transactionModel.insertMany(transaction);
      for (const item of updatedStatus.products) {
        const product = item.product;

        const updatedQuantity = product.quantity + item.quantity;
        const updatedOrders = product.orders - item.quantity;
        await Product.findByIdAndUpdate(product._id, { quantity: updatedQuantity, orders: updatedOrders });
      }

    }

    res.status(200).json({ success: true, message: "Operation completed successfully" });

    console.log(updatedStatus);

  } catch (error) {
    console.log(error);
  }
}


//coupon
const applyCoupon = async(req,res)=>{
  try {
    const enteredCode = req.body.CouponCode;
    const coupon = await Coupon.findOne({CouponCode : enteredCode});
    const user = req.session.user_id;
    const userCart = await Cart.findOne({user:user})

    if(coupon){
      const newTotal = userCart.total - coupon.discount;
      userCart.total = newTotal;
      userCart.appliedCoupon = coupon.CouponCode;

      await userCart.save();
    }
    else{
      res.render('checkOut',{message:'coupon not available for you'})
    }
    res.redirect('/checkOut')
  } catch (error) {
    console.log(error.message);
  }
}
 

const removeCoupon = async (req,res)=>{
  try {
    const appliedCoupon = req.body.CouponCode;
    const coupon = await Coupon.findOne({ CouponCode : appliedCoupon });
    const user = req.session.user_id;
    const userCart = await Cart.findOne({user:user});
    if(coupon){
      const newTotal = userCart.total +  coupon.discount;
      userCart.total = newTotal;
      userCart.appliedCoupon = '';

      await userCart.save();
    
    }
    else{
      res.render('checkOut',{message:'coupon not available'})
    }
    res.redirect('/checkOut')
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
    loadCheckOut,
    confirmOrder,
    loadSuccess,
    loadOrderList,
    loadOrderDetails,
    orderStatus,
    updatedPayment,
    cancelOrder,
    returnRequest,
    returnOrderList,
    returnOrderDetails,
    returnResponse,
    applyCoupon,
    removeCoupon

}