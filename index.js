const express = require("express");
const methodOverride = require("method-override")
const path = require('path');
const bodyParser = require("body-parser")
const flash = require("express-flash")
const cookieParser= require("cookie-parser");
const session = require("express-session");
const moment = require("moment");

require("dotenv").config();

const routes = require("./routes/client/index.route");
const routesAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended : false }));

//parse application/x-ww-form-urlencoded
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//Flash
app.use(cookieParser("Thienvo"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// TinyMCE
app.use(
  '/tinymce',
  express.static(path.join(__dirname,
    'node_modules', 'tinymce'
)));

app.use(express.static(`${__dirname}/public`));

//app local variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

//routes
routes(app);
routesAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});