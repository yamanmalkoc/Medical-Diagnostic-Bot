var mysql = require('mysql');

var con = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '291#5hioRRL76T',
database: 'users'
});

var fs = require ('fs');

var insertPath = './testJsonInsert.json';
var parsed = JSON.parse(fs.readFileSync(insertPath, 'UTF-8'));


var con = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '291#5hioRRL76T',
database: 'users'
});

con.connect(function(err){
if(err)throw err;
console.log("Connected");

var first = "Bryson";
var age = 21;
var height = 200;
var weight = 80;
var last = "Marazzi";
var gender = "male";
var user = "Bruceson";
var password = "test"; 

console.log(age);
console.log(first);

var params = [first, last, user, password, gender, age, height, weight];

var sql = "insert into userinfo (firstName, lastName, userName, password, gender, age, height, weight) values (?,?,?,?,?,?,?,?)";
con.query(sql,params, function(err,result){
if(err) throw err;
console.log("info inserted");
});
});

