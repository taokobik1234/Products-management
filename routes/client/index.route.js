const productsRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middlewares")
module.exports = (app) =>{
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.get("/",homeRoute);
    app.use("/products",productsRoute);
    app.use("/search",searchRoute);
    app.use("/cart",cartRoute);
    app.use("/checkout",checkoutRoute);
    
}