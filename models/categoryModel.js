const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_list:{
        type:Boolean,
        default:true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    offer:{
        type:Number
    }

})


module.exports = mongoose.model('Category',categorySchema)