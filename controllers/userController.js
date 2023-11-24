const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel')

//to bcrypt the password
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
}



//to load the register page
const loadRegister = async (req, res) => {
  try {
    res.render('registration')
} catch (error) {
    console.log(error.message);
  }
}




//setting otp function
function generateOTP() {
    return randomstring.generate({
        length:4,
        charset:'numeric'
        
    })
}

//send the otp via email
function sendOtp(email,otp){
    const Email = email;
    const mailOptions = {
        from:process.env.node_email,
        to:Email,
        subject:'OTP Verification',
        text:`your OTP for verification is ${otp}`
    }



//transport the mail using nodemailer
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.node_email,
        pass:process.env.node_password
    }
});

transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        console.error('Error sending mail' + error);
    }
    else{
        console.log('Email send' + info.response);
    }
});
}


// Later in your code, you can call sendOtp(email, otp) to send the email with the OTP.


//adding user from the sign up page
//to insert user data

const insertUser = async(req,res)=>{

    try{
    
        const user =  User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: req.body.password
        });

        req.session.userData = {
            _id:user._id,
            name:user.name,
            email:user.email,
            mobile:user.mobile,
            password:user.password,
        };

        const otp = generateOTP();
        console.log("IIIIIIIIIII"+otp);
        req.session.otp = otp;

        sendOtp(req.body.email,otp);

        res.redirect('/otpverification')

        if(user){
            res.render("registration",{message:"registration successful"})
        }
        else{
            res.render("registration",{message:"registration unsuccessful"})
        }
    }catch(error){
        console.log(error.message);
}

}


//loadotpverification page
const loadOtpVerification = async(req,res)=>{
    try {
        res.render('otpverification')
    } catch (error) {
        console.log(error.message);
    }
}


const verifyOtp = async (req,res)=>{
    try {
        const enteredOTP = req.body.otp;
        const storedOTP =req.session.otp;
        const userData = req.session.userData; //Access userdata from the session

        if(enteredOTP==storedOTP){
            delete req.session.otp;

            console.log(userData.password);
            const spassword = await securePassword(userData.password);
            const user = User({
                name:userData.name,
                email:userData.email,
                mobile:userData.mobile,
                password:spassword,
                is_verified:1
            })

            await user.save();
            res.redirect('/landingHome');
            
        }
        else{
            res.render('otpverification')
        }
    } catch (error) {
        console.log(error.message,{errorMessage:'Invalid OTP.Please try again'});
    }
}

// const loadHome = async(req,res)=>{
//     try {
//         const product = await Product.find();
//         res.render('home',{product})
//     } catch (error) {
//         console.log(error.message);
//     }
// }

//home before signup
const loadLandingHome = async (req, res) => {
    try {
        const user = req.session.user_id;
        const allProduct = await Product.find().sort({ createdAt: -1}).limit(8);
        const newArrivals = await Product.find().sort({ createdAt: -1}).limit(6)
        // const products = await Product.find().sort({createdAt: -1})
        console.log("////////////////"+allProduct.createdAt);
        console.log(allProduct); // Log the products to the console

        res.render('landingHome', { allProduct , newArrivals , user});
    } catch (error) {
        console.log(error.message);
    }
}


//login after signup
const   loadLogin = async(req,res)=>{
    try {
        const user = req.session.user_id
        res.render('login',{user})
    } catch (error) {
        console.log(error.message);
    }
}

//verifyLogin
const verifyLogin=async(req,res)=>{
    try{

        const email=req.body.email;
        const password=req.body.password
       const userData= await User.findOne({email:email})
       console.log(userData);
   if(userData){
    console.log(password);
    console.log(userData.password);
           const match=await bcrypt.compare(password,userData.password)
           console.log(match);
      if(match){

        
        if(userData.is_verified === false){
            
            res.render('login',{message:"please varify your mail"})

        }
        else{
            if(userData.is_blocked === false){
                req.session.user_id=userData._id;
                const user  = req.session.user_id
                const allProduct = await Product.find();
                const newArrivals = await Product.find().sort({createdAt:-1}).limit(6)
                console.log(allProduct);
                res.render('landingHome',{ allProduct , newArrivals , user })
            }
            else{
                res.render('login',{message:'Your account has temporarily suspended'})
               
            }
          
        }

      }
      else{
        res.render('login',{message:"Email and password do not match"});
      }

   }else{
    res.render('login',{message:"login invalid"})
   }

    }catch(error){
        console.log(error.message)
    }

}

//load shop page
const loadProduct = async(req,res)=>{
    try {
        const categories = await Category.find();
        res.render('products',{categories})
    } catch (error) {
        console.log(error.message);
    }
}


//load product details
async function loadproductDetail(req,res){
    try {
        const user  = req.session.user_id
        const id = req.query.id;
        console.log(id);
        const products = await Product.findById(id);
        
        console.log(products + "oooooooooooooooooo");
        res.render('productDetails',{products , user })
    } catch (error) {
        console.log(error.message);
    }
}

const loadLogout=async(req,res)=>{

    try{
        req.session.user_id = null;
        // const user=req.session.user_id
        // const newArrivals = await Product.find()
        // const allProduct = await Product.find()
        res.redirect('/landingHome'); 
  
    }catch(error){
        console.log(error.message)
  
    }
  
  }

module.exports = {
    loadRegister,
    insertUser,
    loadOtpVerification,
    verifyOtp,
    loadLandingHome,
    loadLogin,
    loadLogout,
    verifyLogin,
    loadProduct,
    loadproductDetail
};