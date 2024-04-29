const Product = require("../../models/product.model");
const productsHelper = require("../../helper/product")
// [Get]
module.exports.index = async (req, res) => {
    // Get remarkable product
    const productsFeatured = await Product.find({
       featured:"1",
       deleted: false,
       status: "active" 
    }).limit(6);
    // console.log(productFeatured);
    const newProductsFeatured= productsHelper.priceNewProducts(productsFeatured);

    // get latest product
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc"}).limit(6);
    const newProductsNew = productsHelper.priceNewProducts(productsNew)

    res.render("client/pages/home/index",{
        pageTitle: "Home",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}