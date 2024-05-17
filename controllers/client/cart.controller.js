const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productsHelper = require("../../helper/product")

// [GET] /cart/
module.exports.index = async (req,res) =>{
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    })
    // console.log(cart)
    if(cart.products.length > 0){
        for(const item of cart.products){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId
            })
            productInfo.priceNew = productsHelper.priceNewProduct(productInfo)
            item.productInfo= productInfo;
            item.totalPrice =item.quantity * productInfo.priceNew;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item)=> sum + item.totalPrice, 0)
    res.render("client/pages/cart/index",{
        pageTitle: "Cart",
        cartDetail: cart
    });
}

// [POST] /cart/add/:id
module.exports.addPost = async (req,res) =>{
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    const quantity = parseInt(req.body.quantity);
    const cart = await Cart.findOne({
        _id: cartId
    });

    const existProduct = cart.products.find(item => item.product_id == productId);
    if(existProduct){
        const newquantity = quantity + existProduct.quantity;
        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },{
                'products.$.quantity': newquantity
            }
        )
        console.log(cart);
    }else{
        const objectCart ={
            product_id: productId,
            quantity: quantity
        }
        await Cart.updateOne({
            _id: cartId
        },{
            $push: {products: objectCart}
        });
    }
    
    
    req.flash("success","Add to cart successfully")
    res.redirect("back");
}

// [GET] /delete/add/:id
module.exports.delete = async (req,res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne(
        {
            _id: cartId
        },{
            "$pull" :{products: {"product_id": productId}}
        }
    );

    req.flash("success","Delete successfully product from cart")
    res.redirect("back");
}

// [GET] /delete/add/:id
module.exports.update = async (req,res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    await Cart.updateOne(
        {
            _id: cartId,
            'products.product_id': productId
        },{
            'products.$.quantity': quantity
        }
    );


    req.flash("success","Delete successfully product from cart")
    res.redirect("back");
}