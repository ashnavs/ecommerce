const { model } = require('mongoose');
const Cart = require('../models/cartModel');
const product = require('../models/productModel');
const { path } = require('../routes/userRoute');
const user = require('../models/userModel')


const addToCart = async (req, res) => {
  try {

    const productId = req.query.productId;
    const userId = req.session.user_id;

    let userCart = await Cart.findOne({ user: userId }).populate('products.product');
  

    if (!userCart) {

      userCart = new Cart({ user: userId, products: [] })
      
    }
    const existingProduct = userCart.products.find((item) => {
      return item.product._id.toString() === productId;
    });



    if (existingProduct) {
      existingProduct.quantity += 1;

    } else {
      userCart.products.push({
        product: productId,
        quantity: 1,
      });
    }
    

    // Update cart properties
    userCart.quantity += 1;
    userCart.subtotal += product.discountPrice;


    await userCart.save();
    res.redirect('/cartPage');


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






const loadCart = async (req, res) => {
  try {
    const user = req.session.user_id;
    const userCart = await Cart.findOne({ user }).populate('user').populate('products.product');


    if (!userCart) {
      return res.render('cart', { products: [], subtotal: 0, total: 0, user, userCart }); // Render the cart page with an empty product array
    }

    let subtotal = 0;
    userCart.products.forEach((item) => {
      item.subTotal = item.product.discountPrice * item.quantity;
      subtotal += item.subTotal;
    });

    const total = subtotal;
    userCart.subTotal = subtotal;
   
    userCart.total = total;
    await userCart.save();

    res.render('cart', { userCart, user});


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

};



// const updateQuantity = async (req, res) => {
//   try {
//     const { productId, newQuantity } = req.body;
//     const userId = req.session.user_id;
   

//     // Find the user's cart
//     const userCart = await Cart.findOne({ user: userId }).populate('products.product');


//     if (!userCart) {
//       return res.status(404).json({ success: false, message: 'Cart not found for the user.' });
//     }

//     // Find the product in the cart
//     const productIndex = userCart.products.findIndex(item => item.product._id.toString() === productId);

//     if (productIndex !== -1) {
//       // Update the quantity
//       userCart.products[productIndex].quantity = parseInt(newQuantity, 10);

//       // Update the total for the specific product
//       userCart.products[productIndex].total = userCart.products[productIndex].quantity * userCart.products[productIndex].product.discountPrice;

//       productTotal = userCart.products[productIndex].total
//       // Recalculate the subtotal and total for the entire cart
//       const newTotal = userCart.products.reduce((acc, item) => {
//         const itemTotal = item.total || 0; // Handle the case where item.total is undefined or NaN
     
//         return acc + itemTotal;
//       }, 0);

//       await userCart.save();
//       res.status(200).json({ success: true, total: newTotal, userCart ,productTotal});
//     } else {
//       res.status(404).json({ success: false, message: 'Product not found in the cart.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };


const updateQuantity = async (req, res) => {
  try {
      const userId = req.session.user_id;
      const { productId, newQuantity } = req.body;

      const userCart = await Cart.findOne({ user: userId }).populate('products.product');

      if (!userCart) {
          return res.status(404).json({ success: false, message: 'Cart not found for the user.' });
      }

      const productIndex = userCart.products.findIndex(item => item.product._id.toString() === productId);

      if (productIndex !== -1) {
          const product = userCart.products[productIndex].product;
          const availableStock = product.quantity;

          if (parseInt(newQuantity, 10) > availableStock) {
              return res.status(200).json({ success: true, insufficientStock: true });
          }

          userCart.products[productIndex].quantity = parseInt(newQuantity, 10);
          userCart.products[productIndex].total = userCart.products[productIndex].quantity * userCart.products[productIndex].product.sales_price;

          const newTotal = userCart.products.reduce((acc, item) => {
              const itemtotal = item.total || 0;
              return acc + itemtotal;
          }, 0);
          // userCart.total = newTotal;

          await userCart.save();
          res.status(200).json({ success: true, total: newTotal, userCart });
      } else {
          res.status(404).json({ success: false, message: 'Product not found in the cart.' });
      }
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const removeProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    const user = req.session.user_id;

    const userCart = await Cart.findOne({ user: user });

    if (userCart) {
      const productIndex = userCart.products.findIndex((item) =>
        item.product.toString() === productId
      );

      if (productIndex !== -1) {
        const removedProduct = userCart.products[productIndex];
  

        const removedsubTotal = removedProduct.subTotal;


        userCart.products.splice(productIndex, 1);

        // Check if removedsubTotal is a valid number
        if (!isNaN(removedsubTotal)) {
          userCart.total = userCart.total - removedsubTotal;
        } else {
          // Handle the case where removedsubTotal is not a number
          console.error('Invalid removedsubTotal:', removedsubTotal);
        }

        await userCart.save();

        res.redirect('/cartPage');
      } else {
    
        res.redirect('/cartPage');
      }
    } else {
    
      res.redirect('/cartPage');
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




module.exports =
{
  addToCart,
  loadCart,
  updateQuantity,
  removeProduct
}