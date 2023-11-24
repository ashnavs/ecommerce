// controllers/cartController.js

const { model } = require('mongoose');
const Cart = require('../models/cartModel');
const product = require('../models/productModel');
const { path } = require('../routes/userRoute');
const user = require('../models/userModel')


const addToCart = async (req, res) => {
  try {

    console.log("////////////////////////////////");

    const productId = req.query.productId;
   const userId = req.session.user_id;

    console.log("////"+productId);

    let userCart = await Cart.findOne({ user: userId }).populate('products.product');
    console.log(userCart);

    if (!userCart) {
         userCart = new Cart ({user:userId , products : []})
         console.log("new cart is created"+ userCart);
    }
  
    

   
 const existingProduct = userCart.products.find((item) => {
  return item.product._id.toString() === productId;
});

    
     
    console.log(existingProduct);

    if (existingProduct) {
      existingProduct.quantity += 1;

    } else {
      userCart.products.push({
        product: productId,
        quantity: 1,
         // Assuming you have a 'price' property in your product model
      });
    }

    // Update cart properties
    userCart.quantity += 1;
    userCart.subtotal += product.price;
    // userCart.total = userCart.subtotal; // You can add additional logic for taxes, discounts, etc.

    await userCart.save();
    res.redirect('/cartPage');

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// viewcart
// controllers/cartController.js

// Assuming you have a Cart model


const loadCart = async (req, res) => {
  try {
    // Add logic to fetch the user's cart data
    const user= req.session.user_id;
    const userCart = await Cart.findOne({ user}).populate('user').populate('products.product');
  

    if (!userCart) {
      // Handle the case where the user has no cart data
      return res.render('cart', { products: [] }); // Render the cart page with an empty product array
    }

    // Pass the cart data to the cart view

    res.render('cart',{userCart , user});
    

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};

////////



module.exports = 
{
    addToCart,
    loadCart,
    
}