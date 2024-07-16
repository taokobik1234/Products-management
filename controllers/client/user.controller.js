const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const Cart = require("../../models/cart.model")

const md5 = require("md5");

const generateHelper = require("../../helper/generate");
const sendMailHelper = require("../../helper/sendMail");

// [Get] /user/register
module.exports.register = async (req,res) =>{
    res.render("client/pages/user/register",{
        pageTitle: "Sign Up"
    })
}

// [POST] /user/register
module.exports.registerPost = async (req,res) =>{
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if(existEmail){
        req.flash("error","Email has already exist");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    console.log(user);
    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/");
}

// [Get] /user/login
module.exports.login = async (req,res) =>{
    res.render("client/pages/user/login",{
        pageTitle: "Login"
    })
}

// [POST] /user/login
module.exports.loginPost = async (req,res) =>{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: req.body.email,
        deleted: false 
    });

    if(!user){
        req.flash("error","Email does not exist");
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password){
        req.flash("error","Wrong Password");
        res.redirect("back");
        return;
    }

    if(user.status == "inactive"){
        req.flash("error","Account has been locked");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser",user.tokenUser);

    // save user into collection cart
    await Cart.updateOne({
        _id: req.cookies.cartId
    },{
        user_id: user.id
    })
    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req,res) =>{
    res.clearCookie("tokenUser");
    res.redirect("/");
}

// [Get] /user/forgot/password
module.exports.forgotPassword = async (req,res) =>{
    res.render("client/pages/user/forgot-password",{
        pageTitle: "Get password back"
    })
}

// [POST] /user/forgot/password
module.exports.forgotPasswordPost = async (req,res) =>{
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error","Email does not exist");
        res.redirect("back");
        return;
    }
    // create OTP and save OTP,email to collection forgot-password
    const otp = generateHelper.generateRandomNumber(8);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // send otp to email
    const subject = `OTP to get password`;
    const html = `
        OTP authentication to get password is <b>${otp}</b>.Time to authenticate is 3 minute. Do not share with anyone`;
    sendMailHelper.sendMail(email,subject,html)

    res.redirect(`/user/password/otp?email=${email}`);
    
}
    
// [GET] /user//password/otp
module.exports.otpPassword = async (req,res) =>{
    const email = req.query.email;
    res.render("client/pages/user/otp-password",{
        pageTitle: "Enter OTP",
        email: email
    })
}

// [Post] /user//password/otp
module.exports.otpPasswordPost = async (req,res) =>{
    const email =req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!result){
        req.flash("error","OTP is not valid");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser",user.tokenUser);
    res.redirect("/user/password/reset");
    
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req,res) => {
    res.render("client/pages/user/reset-password",{
        pageTitle: "Change password"
    });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req,res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    },{
        password: md5(password)
    });

    req.flash("success","Success to reset password");
    res.redirect("/");

}

// [GET] /user/info
module.exports.info = async (req,res) => {
    res.render("client/pages/user/info",{
        pageTitle: "Account information"
    });
}

