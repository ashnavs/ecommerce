const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    model: {
        required: true,
        type: String
    },
    screenSize: {
        required:true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    discountPrice: {
        required: true,
        type: Number
    },
    quantity: {
        required: true,
        type: Number
    },
    brand: {
        required: true,
        type: String
    },
    productImage: [{
        required: true,
        type: String
    }],
    // ratings:[{
    //     required:true,
    //     type:String
    //   }],
    ram: {
        required: true,
        type: String
    },
    storage: {
        required: true,
        type: String
    },
    processor: {
        required: true,
        type: String
    },
    list: {
        type: Boolean,
        default: true
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        type:String,
        
    },
    graphicsCard: {
        type: String,
        required: true
    },
    osArchitecture: {
        type: Number,
        default: 64
    },
    os: {
        type: String,
        default: "Windows 11"
    }

});

module.exports = mongoose.model('Product', productSchema)


