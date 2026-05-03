var express = require("express");
var route = express.Router();
var exe = require("../connection");
var jwt=require("jsonwebtoken");


let KEY="hcddjgj";

route.get("/login",function(req,res){
    res.render("admin/login.ejs")
})
route.post("/do_login",async function(req,res){
    let sql=`SELECT * FROM users WHERE email='${req.body.email}' AND password='${req.body.password}'`
    var data=await exe(sql);
    if(data.length>0){
        let token=jwt.sign({email:req.body.email},KEY)
        res.cookie("token",token);
    
   res.redirect("/admin/dashboard");

    }else{
       
    res.redirect("/admin/login");
    }
    // res.send(data);
});


function verify(req,res,next){
    let token = req.cookies.token;

    if(!token){
        return res.redirect("/admin/login");
    }
    next();
}

route.get("/dashboard",verify,function(req,res){
    res.render("admin/dashboard.ejs")
})
route.get("/", function (req, res) {
    res.render("admin/login.ejs");
});

route.get("/hero_section",verify, async function (req, res) {
    let sql = `select * from hero_section`;
    let data = await exe(sql);
    let obj = { "info": data }
    res.render("admin/hero_section.ejs", obj);
    // console.log(info);
});

route.post("/save_hero_section", async function (req, res) {
    // res.render("admin/hero_section.ejs");
    //part 1
    let img = Date.now() + req.files.hero_img.name;
    req.files.hero_img.mv("public/" + img);
    //part 2
    var d = req.body;
    let sql = `UPDATE hero_section 
    SET 
    hero_img='${img}', 
    fullname='${d.fullname}', 
    position='${d.position}', 
    details='${d.details}'
    WHERE hero_section_id=1`;
    let data = await exe(sql);
    res.redirect("/admin/hero_section");
});
route.get("/about",verify, function (req, res) {
    res.render("admin/About.ejs");
})
// /admin/save_about
route.post("/save_about", async function (req, res) {
    let sql = `update about set
    about_details='${req.body.about_details}'
    where about_id=1`;

    let data = await exe(sql);
    res.redirect("/admin/about");
});

route.get("/skills",verify, async function(req,res){

    let tech = await exe("SELECT * FROM technical_skills");
    let soft = await exe("SELECT * FROM soft_skills");

    res.render("admin/Skills.ejs", {
        techSkills: tech,
        softSkills: soft
    });
});

route.post("/save_skills", async function(req,res){
    let d = req.body;

    if(d.Tskills && d.Tskills.trim() !== ""){
        await exe(`INSERT INTO technical_skills (skill_name) VALUES ('${d.Tskills}')`);
    }

    if(d.Sskills && d.Sskills.trim() !== ""){
        await exe(`INSERT INTO soft_skills (skill_name) VALUES ('${d.Sskills}')`);
    }

    res.redirect("/admin/skills");
});

route.get("/delete_skills/:id/:type", async function (req, res) {
    let id = req.params.id;
    let type = req.params.type;

    if(type === "T"){
        await exe(`DELETE FROM technical_skills WHERE id=${id}`);
    } else {
        await exe(`DELETE FROM soft_skills WHERE id=${id}`);
    }

    res.redirect("/admin/skills");
});

route.get("/edit_skills/:id/:type", async function(req,res){
    let id = req.params.id;
    let type = req.params.type;

    let table = (type=="T") ? "technical_skills" : "soft_skills";

    let data = await exe(`SELECT * FROM ${table} WHERE id='${id}'`);

    res.render("admin/edit_skills.ejs", {   // ✅ CHANGE HERE
        editData: data[0],
        type: type
    });
});

route.post("/update_skills", async function(req,res){

    let id = req.body.id;
    let type = req.body.type;
    let skill = req.body.skill_name;

    // table decide
    let table = (type === "T") ? "technical_skills" : "soft_skills";

    // update query
    let sql = `UPDATE ${table} SET skill_name='${skill}' WHERE id='${id}'`;

    await exe(sql);

    // redirect back
    res.redirect("/admin/skills");
});
route.get("/education",verify,async function(req,res){
    var sql=`SELECT * FROM education`
    var data=await exe(sql);
    var obj={"edu_list":data}
    res.render("admin/education.ejs",obj);
});
route.post("/save_education",async function(req,res){
    var d=req.body;
    var sql = `INSERT INTO education (course, start_year, end_year, institute, marks, coursework) 
    VALUES 
    ('${d.course}', '${d.start_year}', '${d.end_year}', '${d.institute}', '${d.marks}', '${d.coursework}')`;
    var data=await exe(sql);
    res.redirect("/admin/education");
});
// 🔴 DELETE
route.get("/delete_edu/:id", async function(req, res) {
    let id = req.params.id;

    await exe(`DELETE FROM education WHERE id='${id}'`);

    res.redirect("/admin/education");
});


// 🔴 EDIT (data fetch)
route.get("/edit_edu/:id", async function(req, res) {
    let id = req.params.id;

    let data = await exe(`SELECT * FROM education WHERE id='${id}'`);

    res.render("admin/edit_education.ejs", { edu: data[0] });
});


// 🔴 UPDATE
route.post("/update_edu", async function(req, res) {
    let d = req.body;

    let sql = `
        UPDATE education SET
        course='${d.course}',
        start_year='${d.start_year}',
        end_year='${d.end_year}',
        institute='${d.institute}',
        marks='${d.marks}',
        coursework='${d.coursework}'
        WHERE id='${d.id}'
    `;

    await exe(sql);

    res.redirect("/admin/education");
});
route.get("/projects",verify, async function(req,res){
    let sql=`select*from projects`
    let data=await exe(sql);
    var obj={"project":data}
    res.render("admin/projects.ejs",obj);
});
route.post("/save_project",async function(req,res){
    let d=req.body;
    //part 1
    let img=Date.now()+req.files.image.name;
    req.files.image.mv("public/"+img)
    var sql=`INSERT INTO projects (title,image,technology,link,live_link,details) VALUES ('${d.title}','${img}','${d.technology}','${d.link}','${d.live_link}','${d.details}')`
    var data= await exe(sql) 
    res.redirect("/admin/projects");
});
route.get("/del_project/:id",async function (req,res) {
    var sql=`DELETE FROM projects WHERE id='${req.params.id}'`
    var data=await exe(sql);
    res.redirect("/admin/projects");
});
route.get("/edit_project/:id",async (req,res) => {
    const id=req.params.id;

    var sql=`SELECT * FROM projects WHERE id= '${id}'`

    var data=await exe(sql);
    res.render("admin/edit_project.ejs",{project:data[0]})
});

route.get("/contacts",verify,async function(req,res){
    var sql=`SELECT * FROM contacts `
    var data=await exe(sql);
    var obj={"contact":data}
    res.render("admin/contact.ejs",obj);
});

route.post("/save_contact", async function(req,res){
    let d = req.body;

    if(!d.username || !d.email || !d.msg){
        console.log("❌ Empty blocked");
        return res.redirect("/");
    }

    let sql = `INSERT INTO contacts (username,email,msg)
               VALUES ('${d.username}','${d.email}','${d.msg}')`;

    await exe(sql);

   
});
route.get("/del_contact/:id",async function (req,res) {
    var sql=`DELETE FROM contacts WHERE id='${req.params.id}'`
    var data=await exe(sql);
    res.redirect("/admin/contacts");
});

module.exports = route;
