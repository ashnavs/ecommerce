const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    houseno:{
        type:String,
        required:true
    },
    street:{
        type:String,
    },
    landmark:{
        type:String,
    },
    pincode:{
        type:Number,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    
    country:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model('Address',addressSchema);