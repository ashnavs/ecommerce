const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
            res.render('home')
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}


const isLogout = async(req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
            res.render('landingHome')
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    isLogin,
    isLogout
}