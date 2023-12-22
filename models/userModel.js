
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose =require("mongoose");



const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    // is_admin:{
    //     type:Number,
    //     default:0
    // },
    is_blocked:{
        type:Boolean,
        default:false
    },
    resetToken: String,
    resetTokenExpiration: Date,
    walletAmount :{
        type:Number,
        default:0
    }
})

userSchema.plugin(mongoosePaginate);


module.exports=mongoose.model('User',userSchema)