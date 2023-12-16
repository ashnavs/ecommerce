const Order = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')



const loadReport = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .populate('address')
            .populate({
                path: 'products.product',
                populate: {
                    path: 'category',
                    model: 'Category'
                }
            });

        res.render('report', { orders });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const salesReoprt = async(req, res)=>{
    try {
        const report = await Order.find().populate('address').populate('products.product').populate('user')

    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    salesReoprt,
    loadReport
}