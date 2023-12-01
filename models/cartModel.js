const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number },
      subTotal: { type: Number }, // Price of the product at the time it was added to the cart
    },
  ],

  total: { type: Number, default: 0 }   // Total including any taxes or additional charges

});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
