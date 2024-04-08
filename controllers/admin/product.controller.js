const Product = require("../../models/product.model");
const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helper/filterStatus")
const searchHelper = require("../../helper/search")
const paginationHelper = require("../../helper/pagination")

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // filterStatus
    const filterStatus = filterStatusHelper(req.query);
    
    let find ={
        deleted: false
    };
    if(req.query.status){
        find.status=req.query.status;
    }
   // Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination =paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProducts
    );
        
    //end pagination
    const products = await Product.find(find)
        .sort({position: "desc"})
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    console.log(products); 
    res.render("admin/pages/products/index",{
        pageTitle: "Product",
        products: products, 
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req,res) =>{
    
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({_id:id},{status: status});

    req.flash("success","Update completed");
    res.redirect("back");
}

// [PATCH] /admin/products/change-multi/:status/:id
module.exports.changeMulti = async (req,res) =>{
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids }}, {status:"active"});
            req.flash("success",`Update ${ids.length} products completed`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids }}, {status:"inactive"});
            req.flash("success",`Update ${ids.length} products completed`);
            break;
        case "delete-all" :
            await Product.updateMany({_id: {$in: ids }}, {
                deleted: true,
                deletedAt: new Date(),
            });
            req.flash("success",`Delete ${ids.length} products success`);
            break;
        case "change-position" :
            for(const item of ids){
                let [id,position]= item.split("-");
                position= parseInt(position);
                // console.log(id);
                // console.log(position);
                await Product.updateOne({_id: id}, {
                    position: position
                });
            };
            req.flash("success",`Change position ${ids.length} products success`);
            break;
        default:
            break;
    }

    res.redirect("back");
}

// [DELETE] /admin/products/delete/:id

module.exports.deleteItem = async (req,res) =>{
    const id = req.params.id;
    // await Product.deleteOne({_id:id});
    await Product.updateOne({_id: id},{
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success",`Delete  product success`);
    res.redirect("back");
}

// [GET] /admin/products/create 
module.exports.create = async (req, res) => {
   
    res.render("admin/pages/products/create",{
        pageTitle: "Add new products",
        
    })
}


// [POST] /admin/products/create 
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position==""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }
    
    if(req.file){
        req.body.thumbnail = `/upload/${req.file.filename}`;
    }
    
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit 
module.exports.edit = async (req, res) => {
    try{
        const find ={
            deleted: false,
            _id: req.params.id
        }
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/edit",{
            pageTitle: "Edit product",
            product: product
        })
    }catch (error){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [Patch] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    
    if(req.file){
        req.body.thumbnail = `/upload/${req.file.filename}`;
    }
    
    try {
        await Product.updateOne({
            _id: req.params.id
        },req.body);
        req.flash("success",`Update Successfully!`);
    } catch (error) {
        req.flash("error",`Failed to update`);
    }
    res.redirect("back");
}

// [GET] /admin/products/detail/:id 
module.exports.detail = async (req, res) => {
    try{
        const find ={
            deleted: false,
            _id: req.params.id
        }
    
        const product = await Product.findOne(find);
    
        res.render("admin/pages/products/detail",{
            pageTitle: product.title,
            product: product
        })
    }catch (error){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}


module.exports.restore = async (req, res) => {
    let find ={
        deleted: true
    };
    if(req.query.status){
        find.status=req.query.status;
    }
   // Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination =paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProducts
    );
        
    //end pagination
    const products = await Product.find(find)
        .sort({position: "desc"})
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    console.log(products); 
    res.render("admin/pages/products/restore",{
        pageTitle: "Restore Product",
        products: products, 
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

module.exports.restoreItem = async (req,res) =>{
    const id = req.params.id;
    // await Product.deleteOne({_id:id});
    await Product.updateOne({_id: id},{
        deleted: false,
    });
    req.flash("success",`Restore  product success`);
    res.redirect("back");
}