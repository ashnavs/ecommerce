const { loadLogin } = require("../controllers/userController")

// const isLogin = async(req,res,next)=>{
//     try {
//         if(req.session.admin_id){

//         }
//         else{
//             res.render('adminDashboard')
//         }
//         next()
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const isLogin = async (req, res, next) => {
    try {
        if (req.session.admin_id) {
            // If admin_id is present in the session, proceed to the next middleware or route handler
            next();
        } else {
            // If admin_id is not present in the session, redirect to the admin login page
            res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/admin'); // Redirect to the admin login page in case of an error
    }
};

const isLogout = async(req,res,next)=>{
    try {
        if(req.session.admin_id){}
        else{
            res.render('adminlogin')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}