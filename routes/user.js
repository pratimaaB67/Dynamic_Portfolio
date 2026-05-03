var express=require("express");
var route = express.Router();
var exe=require("../connection");

route.get("/", async function(req,res){

    let hero = await exe("SELECT * FROM hero_section");
    let about = await exe("SELECT * FROM about");
    let tech = await exe("SELECT * FROM technical_skills");
    let soft = await exe("SELECT * FROM soft_skills");
    let educ = await exe("SELECt * From education");
    let project = await exe("SELECt * From projects");

    let obj = {
        hero_data: hero,
        about: about,
        techSkills: tech,
        softSkills: soft,
        educat:educ,
        Proje:project
    };

    res.render("user/index.ejs", obj);
});

route.post("/save_contact", async function (req,res) {
    let d=req.body;
    var sql=`INSERT INTO contacts(username,email,msg) VALUES('${d.username}','${d.email}','${d.msg}')`
    let data=await exe(sql);
    res.redirect("/");
});


module.exports=route;
