const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name:String,
    CouponCode:String,
    discount:Number,
    expiry:Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:true
    },
    minimumCartTotal:Number
})


module.exports = mongoose.model('Coupon' , couponSchema)