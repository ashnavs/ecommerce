// const isLogin = async(req,res,next)=>{
//     try {
//         if(req.session.user_id){}
//         else{
//             res.render('landingHome' ,{allProduct})
//         }
//         next();
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            next();
        } else {
            res.redirect('/login'); // Redirect to the login page
        }
    } catch (error) {
        console.log(error.message);
    }
};



// const isLogout = async(req,res,next)=>{
//     try {
//         if(req.session.user_id){}
//         else{
//             res.render('landingHome')
//         }
//         next();
//     } catch (error) {
//         console.log(error.message);
//     }
// }

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
    isLogin,
    isLogout,
    
}