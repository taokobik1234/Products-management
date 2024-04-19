const express = require("express");
const route = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/account.validate");

const uploadCloud = require("../../middlewares/admin/uploadCLoud.middleware");
const upload = multer();
const controller= require("../../controllers/admin/account.controller");
route.get("/",controller.index);
route.get("/create",controller.create);
route.post("/create",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

route.get("/edit/:id",controller.edit);
route.patch("/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);
module.exports = route;