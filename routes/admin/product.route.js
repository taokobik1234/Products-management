const express = require("express");
const multer = require("multer");

const route = express.Router();
const storageMulter = require("../../helper/storageMulter");

const uploadCloud = require("../../middlewares/admin/uploadCLoud.middleware");
const upload = multer();
const controller= require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");


route.get("/",controller.index);
route.patch("/change-status/:status/:id",controller.changeStatus);
route.patch("/change-multi",controller.changeMulti);
route.delete("/delete/:id",controller.deleteItem);
route.get("/restore",controller.restore);
route.patch("/restore/:id",controller.restoreItem);

route.get("/create",controller.create);

route.post("/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);



route.get("/edit/:id",controller.edit);
route.patch("/edit/:id",
    upload.single("thumbnail"),
    validate.createPost,
    controller.editPatch
);

route.get("/detail/:id",controller.detail);


module.exports = route;
