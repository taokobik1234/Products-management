const Role = require("../../models/role.model")
const systemConfig = require("../../config/system")


// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find ={
        deleted: false
    };

    const records = await Role.find(find);
    res.render("admin/pages/roles/index",{
        pageTitle: "Roles permission",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create",{
        pageTitle: "Create Role",
        
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {

    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find={
            _id: id,
            deleted: false
        };

        const data = await Role.findOne(find);

        res.render("admin/pages/roles/edit",{
            pageTitle: "Edit Roles Permission",
            data: data
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Role.updateOne({_id:id},req.body);
        req.flash("success","Update success")
        res.redirect("back");
    } catch (error) {
        req.flash("error","Update failed")
    }
    
}