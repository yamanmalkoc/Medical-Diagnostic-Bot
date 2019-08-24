/*
A few of the main database related functions: insertNewUser, insertHearingResults, checkValidUser, and inputTestInfo. The rest of the functions have been put into ../vm_server_EXPRESS.js
*/

//Makes a connection to the database
function makeAConnection(){
    var mysql = require('mysql');
    var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '291#5hioRRL76T',
    database: 'users'
    });
    return con;
  }

module.exports = {

    //Take in parameters directly from the html sign up sheet. Make a new user if the username does not already exist.
    insertNewUser: function (first, last, username, password,gender,age,height,weight){
        var con = makeAConnection();
        con.connect(function(err){
      if(err) throw err;
        var params = [first, last, username, password, gender, age, height, weight];
        var sql = "insert into userinfo (firstName, lastName, userName, password, gender, age, height, weight) values (?,?,?,?,?,?,?,?)";
        console.log(username);
            con.query(sql,params, function(err,result){
                if(err) throw err;
                console.log("info inserted");
                return 1;
            });
        });
    },
    //Take in parameters directly from the html hearing test. Inserts new hearing info into table regardless of whether user has another entry.
    //DEPRECATED: new function inputTestInfo, takes in an extra parameter 'test', which allows it to input any kind of test's data.
    insertHearingResults: function (userName, left, right){
        var con = makeAConnection();
        con.connect(function(err){
        if(err) throw err;
        var date = 1234;
        var params = [userName, left, right, date];
        var sql = "insert into hearingInfo (userName, left, right, date) values (?,?,?,?)";
        console.log(username);
            con.query(sql,params, function(err,result){
                if(err) throw err;
                console.log("info inserted");
                return 1;
            });
        });
    },
    //Take in parameters directly from the html hearing test. Inserts new hearing info into table regardless of whether user has another entry.
    checkValidUser: function (username, password, socket){
        var con = makeAConnection();
        con.connect(function(err){

            if(err) throw err;
            var params = [username];

            var sql = "SELECT userName, password FROM userinfo WHERE userName = ?";
            var ret = con.query(sql,params, function(err,result) {

                if (result.length < 1 || result == undefined) {
                  var object = {
                    status: 'failure'
                  }
                  socket.emit('login_result', object);
                }
                else if(result[0]['password'] == password){
                  var object = {
                    status: 'success',
                    username: username
                  }
                  socket.emit('login_result', object);
                }
                else{
                  socket.emit('login_result', 'error');

                }
            });
        });
      },
    //Take in parameters directly from the html hearing test. Inserts new hearing info into table regardless of whether user has another entry.
    inputTestInfo: function(data,test){
        var con = makeAConnection();
                con.connect(function(err){

                    if(err) throw err;
                    //following set of if-else if statements are used to choose the test.
                    if(test=='hearing'){
                        var params = [data.username,data.left_freq,data.right_freq];
                        var sql = "insert into hearingInfo (userName, L, R, dat) values (?,?,?,curdate()) ";
                        con.query(sql,params, function(err,result) {
                        if(err) throw err;

                        });

                    }else if(test=='vision'){
                        var params = [data.username,data.score];
                        var sql = "insert into visionInfo (userName, vscore, dat) values (?,?,curdate()) ";
                        con.query(sql,params, function(err,result) {
                        if(err) throw err;

                        });
                    }else if(test=='reflex'){
                        var params = [data.username,data.score];
                        var sql = "insert into reflexInfo (userName,rscore, dat) values (?,?,curdate()) ";
                        con.query(sql,params, function(err,result) {
                        if(err) throw err;

                        });
                    }else if(test=='heartrate'){
                        var params = [data.username,data.heartrate,data.username,data.heartrate];

                        var sql = "INSERT into heartrate (username, heartrate) values (?,?) on duplicate key update username = ?, heartrate =?";
                        var ret = con.query(sql,params, function(err,result) {
                            if(err) throw err;
                        });
                    }
                    else{
                        console.log('input a legit test: hearing, vision, or reflex');
                    }

    });

}
};
