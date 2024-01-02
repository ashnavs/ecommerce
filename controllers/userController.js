const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { v4: uuidv4 } = require('uuid');
const Address = require('../models/addressModel');
const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')
const transactionModel = require('../models/transactionModel')

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
    res.render('registration',{errorMessage:""})
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
};

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

// const insertUser = async(req,res)=>{

//     try{
    
//         const user =  User({
//             name: req.body.name,
//             email: req.body.email,
//             mobile: req.body.mno,
//             password: req.body.password
//         });

//         req.session.userData = {
//             _id:user._id,
//             name:user.name,
//             email:user.email,
//             mobile:user.mobile,
//             password:user.password,
//         };

//         const otp = generateOTP();
//         console.log("IIIIIIIIIII"+otp);
//         req.session.otp = otp;

//         sendOtp(req.body.email,otp);

//         res.redirect('/otpverification')

//         if(user){
//             res.render("registration",{message:"registration successful"})
//         }
//         else{
//             res.render("registration",{message:"registration unsuccessful"})
//         }
//     }catch(error){
//         console.log(error.message);
// }

// }

const insertUser = async (req, res) => {
    try {
        // Check if email or phone number already exist in the database
        const existingUser = await User.find({
            $and: [
                { email: req.body.email },
                { mobile: req.body.mno }
            ]
        });

        if (existingUser.length > 0) {
            // If users already exist, return an error message
            console.log("Rendering registration with error message");
            return res.render("registration", { errorMessage: "Email or mobile number already exists" });
        }

        // If user doesn't exist, proceed with creating a new user
        const user = new User({
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

        // // Save the user to the database
        /*await user.save();*/

        // Rest of your code for OTP generation and redirection
        const otp = generateOTP();
        console.log("IIIIIIIIIII" + otp);
        req.session.otp = otp;

        sendOtp(req.body.email, otp);

        res.redirect('/otpverification');

    } catch (error) {
        console.log(error.message);
        // Handle other errors
        res.render("registration", { errorMessage: "Registration unsuccessful" });
    }
};








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



//home before signup
const loadLandingHome = async (req, res) => {
    try {
        const user = req.session.user_id;
        const allProduct = await Product.find().sort({ createdAt: -1}).limit(8);
        const newArrivals = await Product.find().sort({ createdAt: -1}).limit(6)
        // const products = await Product.find().sort({createdAt: -1})
        // console.log("////////////////"+allProduct.createdAt);
        // console.log(allProduct); // Log the products to the console

        res.render('landingHome', { allProduct , newArrivals , user });
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
                const user  = req.session.user_id;
                const allProduct = await Product.find();
                const newArrivals = await Product.find().sort({createdAt:-1}).limit(6)
                res.render('landingHome',{ allProduct , newArrivals , user, })
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



 



//resend otp
const verifyResendOtp = async (req, res) => {
    try {
        const enteredOTP = req.body.otp;
        const storedOTP = req.session.otp.otp; 
      
        const userData = req.session.userData; //Access userdata from the session
         console.log(enteredOTP , storedOTP + "//////////");
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
            res.redirect('/login');
        
        }
        else{
            console.log("verification failed");
        }
    } catch (error) {
        console.log(error.message,{errorMessage:'Invalid OTP.Please try again'});
    }
};





const resendOtp = async (req, res) => {
    try {
        const OTP = generateOTP() /** otp generating **/
        req.session.otp = { otp: OTP };
        const userData = req.session.userData; 
        console.log('Generated OTP:', OTP);


    // otp resending //
        try {
            sendOtp( userData.email , OTP);
            console.log('otp is sent');
            console.log(OTP)
            return res.render('resendOtp');
        } catch (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).send('Error sending OTP');
        }

    } catch (error) {
        throw new Error(error)
    }
};


const loadforgotPass = async (req,res) => {
    try {
        res.render('forgot-password',{errorMessage:""})
    } catch (error) {
        console.log(error.message);
    }
};

function generateUniqueToken() {
    return uuidv4();
}

const forgotPass = async (req,res) =>{
    const email = req.body.email;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('forgot-password', { errorMessage: 'User not found' });
        }

        const resetToken = generateUniqueToken();
        const resetTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        sendPasswordResetEmail(user.email, resetToken);

        // Render the confirmation page with the user's email
        return res.render('passConfirmation', { email: user.email });
    } catch (error) {
        console.error('Error in forgot-password route:', error);
        return res.render('error-page', { errorMessage: 'Error processing request' });
    }
};

function sendPasswordResetEmail(email, resetToken) {
    // Implement logic to send an email with a link containing the resetToken
    // Example: Use a library like nodemailer
    // You need to set up nodemailer and configure it with your email provider
    

    const transporter = nodemailer.createTransport({
        // Set up your email transport configuration here
        // For example, you can use SMTP or a service like Gmail
        service:'gmail',
        auth:{
            user:process.env.node_email,
            pass:process.env.node_password
        }
    });

    const resetLink = `http://localhost:3001/resetPassword/${resetToken}`;

    const mailOptions = {
        from: 'your@email.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const loadResestPass = async (req,res) =>{
    const token = req.params.token;
    const user = req.session.user_id
    try {
        res.render('resetPassword',{token ,user })
    } catch (error) {
        console.log(error.message);
        res.redirect('/login'); // Redirect to login or another page on error
    }
};


const resetPass = async (req, res) => {
    const { token, newPassword } = req.body;
    const users = req.session.user_id;
    const newArrivals = await Product.find();

    try {
        // Find the user with the given token
        const user = await User.findOne({ resetToken: token });
        const allProduct = await Product.find()

        if (!user) {
            // Token is not valid or expired
            return res.render('resetPassword', { message: 'Invalid or expired token' , token ,user });
        }

        
        

        // Update the user's password with the new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the number of salt rounds
        user.password = hashedPassword;

        // Clear the resetToken and resetTokenExpiration in the database
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        // Save the updated user information
        await user.save();

        // Redirect to the login page with a success message
        res.render('login', { message: 'Password reset successful. You can now log in with your new password.' });
    } catch (error) {
        console.error('Error in resetPass:', error);
        // res.render('error-page', { errorMessage: 'Error processing password reset request' });
    }
};

const loaduserProfile = async(req,res)=>{
    try {
        const user = req.session.user_id;
        console.log(user+"///////////////dcvsfdsfdsfdsfdscvbvcc");
        const userDetail = await User.findById(req.session.user_id);
        const address = await Address.find({user:user})
        const orderDetails = await Order.find({user:user}).sort({createdAt:-1})
        console.log(orderDetails);
        const transactions = await transactionModel.find({ user: user }).sort({ date: -1 });
        console.log("transactionsssssssssssssssssssssss"+transactions);
        res.render('user' ,{ user , userDetail , address , orderDetails , transactions})
    } catch (error) {
        console.log(error.message);
    }
  }


const addBillingAddress = async (req, res) => {
  try {
    // Assuming user information is available in req.userDetail (you may need to modify this based on your setup)
    const userId = req.session.user_id;
    

    // Extract address data from the form submission
    const {
      name,
      email,
      mobile,
      houseno,
      street,
      landmark,
      pincode,
      city,
      country,
    } = req.body;

    // Create a new address instance
    const newAddress = new Address({
      user: userId,
      name,
      email,
      mobile,
      houseno,
      street,
      landmark,
      pincode,
      city,
      country,
    });

    // Save the new address to the database
    await newAddress.save();

    // Respond with success message
    res.redirect('/user');
    // res.json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// const updateUserProfile = async(req,res) => {
//     try {
//         const userId = req.session.user_id;
//         const {displayName , phoneNumber , currPass , newPass, confirmNewPassword} = req.body;

//         const user = await User.findById(userId);

//          // Check if the provided current password matches the stored hashed password
//          if (currPass && !bcrypt.compareSync(currPass, user.password)) {
//             return res.status(400).json({ success: false, message: 'Current password is incorrect' });
//         }

//         user.name = displayName;
//         user.mobile = phoneNumber;

//          // If a new password is provided, hash and update the password
//          if (newPass) {
//             if (newPass !== confirmNewPassword) {
//                 return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
//             }

//             // Hash the new password
//             const hashedPassword = bcrypt.hashSync(newPass, 10);
//             user.password = hashedPassword;
//         }

//         // Save the updated user details to the database
//         await user.save();

//         // Redirect to the user profile page or display a success message
//         res.redirect('/login');
//     } catch (error) {
//         console.error(error);
//         // res.status(500).json({ success: false, message: 'Internal server error' });
//           // Extract validation error messages
//           const validationErrors = Object.values(error.errors).map(err => err.message);
//           return res.status(400).json({ success: false, validationErrors });
//     }
// };

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { displayName, phoneNumber, currPass, newPass, confirmNewPassword } = req.body;

        const user = await User.findById(userId);

        // Check if the provided current password matches the stored hashed password
        if (currPass && !bcrypt.compareSync(currPass, user.password)) {
              return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
        }

        user.name = displayName;
        user.mobile = phoneNumber;

        // If a new password is provided, hash and update the password
        if (newPass) {
            if (newPass !== confirmNewPassword) {
                return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
            }

            // Hash the new password
            const hashedPassword = bcrypt.hashSync(newPass, 10);
            user.password = hashedPassword;
        }

        // Save the updated user details to the database
        await user.save();
        res.redirect('/login');
        // Redirect to the user profile page or display a success message
        //res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




async function orderdetails(req,res){
    try {
      const user = req.session.user_id;
      const orderId = req.query.orderId;
      const orderDetails = await Order.findById(orderId).populate('address').populate('products.product')
      res.render('orderDetails',{orderDetails , user})


    } catch (error) {
      console.log(error);
    }
}


// const editAddress = async(req,res) => {
//     try {
//         const addressId = req.query.addressId;
//         console.log(addressId);
//     } catch (error) {
//         console.log(error.message);
//     }
// }


// const editAddress = async (req, res) => {
//     try {
//       // Assuming user information is available in req.userDetail (you may need to modify this based on your setup)
//       const userId = req.session.user_id;
//       const user = req.session.user_id;
  
//       // Extract address data from the form submission
//       const {
//         name,
//         email,
//         mobile,
//         houseno,
//         street,
//         landmark,
//         pincode,
//         city,
//         country,
//       } = req.body;
  
//       const addressId = req.query.id;

//       console.log('Received addressId:', addressId);
//       console.log('Received userId:', userId);
  
//       // Find the address in the database
//       const existingAddress = await Address.findOne({ user: userId });
  
//       // Check if the address exists
//     //   if (!existingAddress) {
//     //     return res.status(404).json({ success: false, message: 'Address not found' });
//     //   }
  

//     if (!existingAddress) {
//         // Render a custom 404 page
//         return res.render('error', { layout: 'errorLayout' ,user }); // Assuming you have a 404.ejs file in your views folder
//         // return res.send('404')
//     }

//       // Update the existing address fields
//       existingAddress.name = name;
//       existingAddress.email = email;
//       existingAddress.mobile = mobile;
//       existingAddress.houseno = houseno;
//       existingAddress.street = street;
//       existingAddress.landmark = landmark;
//       existingAddress.pincode = pincode;
//       existingAddress.city = city;
//       existingAddress.country = country;
  
//       // Save the updated address to the database
//       await existingAddress.save();
  
//       // Respond with success message
//       res.redirect('/user');
//       // res.json({ success: true, message: 'Address updated successfully' });
//     } catch (error) {
//       // Handle any errors that may occur during the process
//       res.redirect('/error')
//       console.error(error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   };

const editAddress = async (req, res) => {
    try {
      // Assuming user information is available in req.userDetail (you may need to modify this based on your setup)
      const userId = req.session.user_id;
  
      // Extract address data from the form submission
      const {
        name,
        email,
        mobile,
        houseno,
        street,
        landmark,
        pincode,
        city,
        country,
      } = req.body;
  
      const addressId = req.query.addressId;

      console.log('Received addressId:', addressId);
      console.log('Received userId:', userId);
  
      // Find the address in the database
      const existingAddress = await Address.findOne({ _id:addressId , user:userId});
  
      // Check if the address exists
      if (!existingAddress) {
        return res.status(404).json({ success: false, message: 'Address not found' });
      }
  
      // Update the existing address fields
      existingAddress.name = name;
      existingAddress.email = email;
      existingAddress.mobile = mobile;
      existingAddress.houseno = houseno;
      existingAddress.street = street;
      existingAddress.landmark = landmark;
      existingAddress.pincode = pincode;
      existingAddress.city = city;
      existingAddress.country = country;
  
      // Save the updated address to the database
      await existingAddress.save();
  
      // Respond with success message
      res.redirect('/user');
      // res.json({ success: true, message: 'Address updated successfully' });
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };







  const loadeditAddress = async(req,res) => {
    try {
        const user = req.session.user_id;
        const addressId = req.query.addressId;
        const address = await Address.findById(addressId);
        
    
        res.render('editAddress',{address , user , addressId})
    } catch (error) {
        res.redirect('/error')
        console.log(error.message);
    }
  }
  

const loadError = async(req,res)=>{
    try {
        const user = req.session.user_id;
        res.render('error',{user})
    } catch (error) {
        console.log(error.message);
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
    loadproductDetail,
    loaduserProfile,
    resendOtp,
    verifyResendOtp,
    loadforgotPass,
    forgotPass   ,
    loadResestPass,
    resetPass,
    addBillingAddress,
    updateUserProfile,
    orderdetails,
    editAddress,
    loadeditAddress,
    loadError
    


};