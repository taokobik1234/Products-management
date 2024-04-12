const dashboardRoutes = require("./dashboard.route")
const productsRoutes =  require("./product.route")
const productsCategoryRoutes =  require("./product-category.route")
const systemConfig = require("../../config/system")

module.exports = (app) =>{
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN+"/dashboard",dashboardRoutes);
    app.use(PATH_ADMIN+"/products",productsRoutes);
    app.use(PATH_ADMIN+"/products-category",productsCategoryRoutes);
}