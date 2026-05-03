var mysql=require("mysql2");
var util=require("util");

var conn=mysql.createConnection({
    host:"bywoqcfmlmaaaewerfaj-mysql.services.clever-cloud.com",
    user:"urppul0vcqdp8ynu",
    password:"agemX3YnUCr7aed3JWs2",
    database:"bywoqcfmlmaaaewerfaj"
});

var exe=util.promisify(conn.query).bind(conn);

module.exports=exe;