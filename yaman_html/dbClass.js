class db{
var mysql = require('mysql');
var fs = require ('fs');

var con;

constructor(){
this.con = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '291#5hioRRL76T',
database: 'users'
});
}

insertNewUser(first, last, username, password,gender,age,height,weight){
	con.connect(function(err){
	if(err)throw err;
	console.log("Connected");

	var params = [first, last, username, password, gender, age, height, weight];

	var sql = "insert into userinfo (firstName, lastName, userName, password, gender, age, height, weight) values (?,?,?,?,?,?,?,?)";
	con.query(sql,params, function(err,result){
	if(err) return 0;
	console.log("info inserted");
	return 1;
	});
	});
}

}

