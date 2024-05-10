const Cart = require("../../models/cart.model")

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