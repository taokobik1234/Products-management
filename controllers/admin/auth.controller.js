const Account = require("../../models/account.model")
const md5 = require("md5");
const systemConfig = require("../../config/system")

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
    res.render("admin/pages/auth/login",{
        pageTitle: "Login"
    })
}

// [Post] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    })

    if(!user) {
        req.flash("error", "Email does not exist")
        res.redirect("back")
        return;
    }

    if(md5(password) != user.password) {
        req.flash("error", "Wrong password")
        res.redirect("back")
        return;
    }

    if(user.status != "active") {
        req.flash("error", "Tài khoản đã bị khóa")
        res.redirect("back")
        return;
    }
    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}