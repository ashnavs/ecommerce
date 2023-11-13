const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
// const { loadLogin } = require('./userController')


const adminLogin = async (req, res) => {
    try {
        res.render('adminlogin')
    } catch (error) {
        console.log(error.message);
    }
}
const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password
        const adminData = await Admin.findOne({ email: email })
        console.log(adminData);


        if (adminData) {

            if (adminData.password === password) {
                req.session.admin_id = adminData._id
                res.redirect('/admin/adminDashboard')

            }
            else {
                console.log("invalid password");
                res.redirect('/adminlogin')
            }

        }
        else {
            res.redirect('/adminlogin');
            console.log("Admin not found");
        }


    } catch (error) {
        console.log(error.message)
        res.redirect('/adminlogin')
    }

}

const loadDashboard = async (req, res) => {
    try {
        res.render('adminDashboard')
    } catch (error) {
        console.log(error.message);
    }
}


const loaduserDetails = async (req, res) => {

    try {

        const datas = await User.find({}).sort({ name: 1 });
        console.log(datas);
        res.render('userDetails', {datas})

    } catch (error) {
        console.log(error.message);
    }


}

const blockUser = async (req, res) => {
    try {
        const id = req.query.id;
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found!");
        }
        user.is_blocked = !user.is_blocked;
        await user.save();
        res.redirect('/admin/userDetails')
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    adminLogin,
    loadDashboard,
    verifyLogin,
    loaduserDetails,
    blockUser,
    

}