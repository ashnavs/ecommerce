
// const isLogin = async (req, res, next) => {
//     try {
//         if (req.session.user_id) {
//             next();
//         } else {
//             res.redirect('/login'); // Redirect to the login page
//         }
//     } catch (error) {
//         console.log(error.message);
//     }
// };

const User = require('../models/userModel')

const isUserBlockedAndLoggedIn = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            const userId = req.session.user_id;
            const user = await User.findById(userId);

            if (user && user.is_blocked) {
                req.session.destroy((err) => {
                    if (err) {
                        console.log("1", err.message);
                    }
                });
                res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
                return res.render('login', { err: "This account is temporarily blocked or unavailable!" });
            } else {
                // User is not blocked, proceed to the next check
                next();
            }
        } else {
            // User is not logged in, redirect to the login page
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error.message);
    }
};








const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // If the user is logged in, proceed to the next middleware
            next();
        } else {
            // If the user is not logged in, render 'landingHome' and return to prevent further execution
            res.render('landingHome');
            return;
        }
    } catch (error) {
        console.log(error.message);
    }
};







module.exports = {
    isUserBlockedAndLoggedIn ,
    isLogout,
    
}