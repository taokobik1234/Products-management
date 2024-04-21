const express = require("express");
const route = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/auth.validate");

const controller= require("../../controllers/admin/auth.controller");

route.get("/login",controller.login);
route.post("/login",validate.loginPost,controller.loginPost);

route.get("/logout",controller.logout);
module.exports = route;