const productsRoute = require("./product.route");
const homeRoute = require("./home.route");

module.exports = (app) =>{
    app.get("/", homeRoute);
      
    app.use("/products",productsRoute);
    
}