var express=require("express");
var userRoute=require("./routes/user");
var adminRoute=require("./routes/admin");
var bodyparser=require("body-parser");
var uplod=require("express-fileupload");
var session=require("express-session");
var cookie=require("cookie-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

var app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(uplod());
app.use(cookieParser())
app.use(session({
    saveUninitialized:true,
    resave:true,
    secret:"asdaashj"
}));
app.use("/",userRoute);
app.use("/admin",adminRoute);



app.listen(600 || process.env.PORT);