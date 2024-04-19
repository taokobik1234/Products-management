const Account = require("../../models/account.model")
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")
const md5 = require("md5");
// [Get] /admin/roles/accounts
module.exports.index = async (req, res) => {
    let find ={
        deleted: false
    };
    const records = await Account.find(find).select("-password -token");

    for(const record of records){
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role =role;
    }
    res.render("admin/pages/accounts/index",{
        pageTitle: "Accounts",
        records: records
    })
    
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    let find ={
        deleted: false
    };
    const roles = await Role.find(find);
    res.render("admin/pages/accounts/create",{
        pageTitle: "Create account",
        roles: roles
    })
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    if(emailExist){
        req.flash("error","Email already exists ");
        res.redirect("back");
    }else{
        req.body.password = md5(req.body.password)
        const records = new Account(req.body);
        await records.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [GET] /admin/accounts/create
module.exports.edit = async (req, res) => {
    let find = {
      _id: req.params.id,
      deleted: false,
    };
  
    try {
      const data = await Account.findOne(find);
  
      const roles = await Role.find({
        deleted: false,
      });
  
      res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        data: data,
        roles: roles,
      });
    } catch (error) {
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    const emailExist = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    })

    if(emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
        res.redirect("back")       
    } else {
        if(req.body.password) {
            req.body.password = md5(req.body.password)
        } else {
            delete req.body.password;
        }
        
        await Account.updateOne({_id: id}, req.body)
        
        req.flash("success", "Cập nhật tài khoản thành công! ")
    }
    
    


    res.redirect("back");
}