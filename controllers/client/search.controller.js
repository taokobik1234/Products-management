const Product = require("../../models/product.model");
const productsHelper = require("../../helper/product")
// [Get] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    let newProducts= [];
    if(keyword){
        const keywordRegex = new RegExp(keyword,"i");
        const products = await Product.find({
            title: keywordRegex,
            status: "active",
            deleted: false
        })

        newProducts = productsHelper.priceNewProducts(products);
    }
    res.render("client/pages/search/index",{
        pageTitle: "Search result",
        keyword: keyword,
        products: newProducts
    })
}