const Order = require('../models/orderModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')


const loadReport = async (req, res) => {
    try {
        const reportOrder = req.query.report;
        console.log(reportOrder);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let filter = { status: "Delivered" };

        if (reportOrder === "Daily") {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            filter.createdAt = {
                $gte: today,
                $lt: tomorrow,
            };
        } else if (reportOrder === "Monthly") {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            filter.createdAt = {
                $gte: startOfMonth,
                $lt: endOfMonth,
            };
        } else if (reportOrder === "Yearly") {
            const startOfYear = new Date(today.getFullYear(), 0, 1); 
            const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
            endOfYear.setHours(0, 0, 0, 0);

            filter.createdAt = {
                $gte: startOfYear,
                $lt: endOfYear,
            };
        }

        const orders = await Order.find(filter)
        .populate('user')
                    .populate('address')
                    .populate({
                        path: 'products.product',
                        populate: {
                            path: 'category',
                            model: 'Category'
                        }
                    });

        const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
        const totalSales = orders.length;
        const totalProductsSold = orders.reduce((sum, order) => sum + order.products.length, 0);

        res.render('report', { orders, reportOrder, totalRevenue, totalSales, totalProductsSold });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};





module.exports={
   loadReport
}