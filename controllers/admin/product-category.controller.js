const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helper/createTree")

// [Get] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);
    
    res.render("admin/pages/products-category/index",{
        pageTitle: "Product category",
        records: newRecords
    })
}
// [Get] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find ={
        deleted: false
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/create",{
        pageTitle: "Creat Product category",
        records: newRecords
    })
}

// [POST] /admin/product-category/create 
module.exports.createPost = async (req, res) => {
    // req.body.price = parseInt(req.body.price);
    // req.body.discountPercentage = parseInt(req.body.discountPercentage);
    // req.body.stock = parseInt(req.body.stock);
    if(req.body.position==""){
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }

    
    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    
}

// [Get] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const id = req.params.id;
        const data = await ProductCategory.findOne({
            _id: id,
            deleted : false
        })

        let find = {
            deleted: false,
        };
        const records = await ProductCategory.find(find);
        const newRecords = createTreeHelper.tree(records);
        
        res.render("admin/pages/products-category/edit",{
            pageTitle: "Edit Product category",
            data : data,
            records: newRecords
        })
    }catch (error){
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
    
}

// [Patch] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);

    
    await ProductCategory.updateOne({
        _id: id
    },req.body);
    res.redirect("back");
}