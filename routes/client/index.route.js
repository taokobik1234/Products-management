const productsRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require("./search.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware")
module.exports = (app) =>{
    app.use(categoryMiddleware.category);
    app.get("/",homeRoute);
    app.use("/products",productsRoute);
    app.use("/search",searchRoute);
    
}