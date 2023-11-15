const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name:String,
    price:Number,
    desciption:String,
    category:String,
    brand:String,
    stockQuantity:Number,
    productImages:String,
    rating:{
        type:Number,
        default:0
    },
    dateCreated:{
        type:Date,
        default:Date.now
    },
    dateUpdated:{
        type:Date,
        default:Date.now
    }


})


