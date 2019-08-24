var mysql = require('mysql');

var con = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '291#5hioRRL76T',
database: 'users'
});

con.connect(function(err){
if(err)throw err;
console.log("Connected");
var sql = "create table userinfo (userID INT AUTO_INCREMENT PRIMARY KEY, firstName varchar(255), lastName varchar(255), userName varchar(255), password varchar(255), gender varchar(255), age int, height float, weight float)";
con.query(sql, function(err,result){
if(err) throw err;
console.log("Table created");
});
});

