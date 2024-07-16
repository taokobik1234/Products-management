const productsRoute = require("./product.route");
const homeRoute = require("./home.route");
const searchRoute = require("./search.route");
const cartRoute = require("./cart.route");
const checkoutRoute = require("./checkout.route");
const userRoute = require("./user.route");
const chatRoute = require("./chat.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middlewares")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")
const authMiddleware = require("../../middlewares/client/auth.middleware")

module.exports = (app) =>{
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.settingGeneral);
    app.get("/",homeRoute);
    app.use("/products",productsRoute);
    app.use("/search",searchRoute);
    app.use("/cart",cartRoute);
    app.use("/checkout",checkoutRoute);
    app.use("/user",userRoute);
    app.use("/chat",authMiddleware.requireAuth,chatRoute);
    
}