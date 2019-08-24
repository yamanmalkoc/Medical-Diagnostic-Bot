/**
 * This is the main javascript file to run the server. It should be executed
 * using Node.js on the remote server.
 *
 **/



//Including shared constants
var CONSTANTS = require('../shared/constants');
//Importing Express.js
var express = require('express');
var dbClass = require('./db/dbClass');
var app = express();

//Express.js setup for node.js server
app.use(express.static('./html'));
app.get('/', (req, res) => {
    res.sendFile('./html/index.html');
});
var server = app.listen(CONSTANTS.PORT);

//Loading socket.io
var io = require('socket.io')(server);

//Global variable to keep track of raspberry PI socket
var pi_socket = null;
//Global variable to keep track of the single logged in user
var current_user = null;
//Actions upon a socket connection
io.sockets.on('connection', function(socket) {
  //Checks if the socket connected is the RP by IP
  if (socket.request.connection.remoteAddress == CONSTANTS.RP_IP) {
    handle_PI(socket);
  }
  //Otherwise assume HTML client
  else {
    console.log("new socket");
    handle_HTML(socket);
  }
});

//Manages all socket requests for HTML webclients
function handle_HTML(socket) {
  //Listens on the general request socket
  socket.on('request', function(request) {
    if (request == CONSTANTS.BLINK) {
      blink(socket);
    }
    else if (request.type == 'get_cur_user_data') {
      getUser(current_user, socket.id);
    }
  });

  //Listens on the 'heart_rate' event
  socket.on('heart_rate', function(request) {
    if (request.type == 'user_input') {
      dbClass.inputTestInfo({username: current_user, heartrate: request.user_input}, 'heartrate');
    }

  });

  //Listens on the 'graphs' event
  socket.on('graphs', function(request) {
    //The main request to get all SQL data from the graphs
    //Event sent in account.html
    if (request.type == 'get_inital_data') {
      getHearing(socket.id);
      getVision(socket.id);
      getReflex(socket.id);
      getUserinfo(current_user,socket.id);
    }
  });

  //Listens on the 'hearing_test' event
  socket.on('hearing_test', function(request) {
    //Checks that the PI is connected before emiting events to it
    if (!pi_connected()) {
      socket.emit('message', 'SERVER: Error, the raspberryPI is not currently connected. ' +
                    'Please connect the PI and try again');
      console.log("SERVER: Error, the raspberry PI is not currently connected");
    }
    else {
      if (request == CONSTANTS.HEARING_TEST_START_LEFT) {
        console.log('HTML: Request to relay left hearing test request');
        pi_socket.emit('hearing_test', {request: CONSTANTS.HEARING_TEST_START_LEFT});
      }
      else if (request == CONSTANTS.HEARING_TEST_START_RIGHT) {
        console.log('HTML: Request to relay right hearing test request');
        pi_socket.emit('hearing_test', {request: CONSTANTS.HEARING_TEST_START_RIGHT});
      }
      else if (request == CONSTANTS.HEARING_TEST_STOP) {
        console.log('HTML: Request to relay stop hearing test request');
        pi_socket.emit('hearing_test', {request: CONSTANTS.HEARING_TEST_STOP});
      }
      else if (request == 'finish_left') {
        console.log('HTML: Request to relay record left hearing test request');
        pi_socket.emit('hearing_test', {request: 'finish_left', socketid: socket.id});
      }
      else if (request == 'finish_right') {
        console.log('HTML: Request to relay record right hearing test request');
        pi_socket.emit('hearing_test', {request: 'finish_right', socketid: socket.id});
      }
      else if (request == 'send_data') {
        console.log('HTML: Request to relay hearing test send data request');
        pi_socket.emit('hearing_test', {request: 'send_data'});
      }
    }

  });

  //Listens on the 'vision_test' event
  socket.on('vision_test', function(request) {
    //Checks that the PI is connected before emiting events to it
    if (!pi_connected()) {
      socket.emit('message', 'SERVER: Error, the raspberryPI is not currently connected. ' +
                    'Please connect the PI and try again');
      console.log("SERVER: Error, the raspberry PI is not currently connected");
    }
    else {
      if (request.type == 'begin_test') {
        pi_socket.emit('vision_test', {request: 'begin_test'});
      }
      else if (request.type == 'input_letter') {
        pi_socket.emit('vision_test', {request: 'input_letter', data: request.data, socketid: socket.id});
      }
      else if (request.type == 'reset') {
        pi_socket.emit('vision_test', {request: 'reset'});
      }
    }
  });

  //Listens on the 'dex_test' event
  socket.on('dex_test', function(request) {
    //Checks that the PI is connected before emiting events to it
    if (!pi_connected()) {
      socket.emit('message', 'SERVER: Error, the raspberryPI is not currently connected. ' +
                    'Please connect the PI and try again');
      console.log("SERVER: Error, the raspberry PI is not currently connected");
    }
    else {
      if (request.type == 'begin') {
        pi_socket.emit('dex_test', {request: 'begin', socketid: socket.id});
      }
      else if (request.type == 'user_input') {
        if (current_user == null) {
          console.log('ERROR: CRITICAL ERROR, please restart the server');
        }
        else {
          dbClass.inputTestInfo({username: current_user, score: request.user_input}, 'reflex');
        }

      }
    }

  });

  //Listens on the 'new_user' event
  socket.on('new_user', function(data) {
      dbClass.insertNewUser(data.first, data.last, data.userName, data.password, data.gender, data.age, data.height, data.weight);
  });

  //Listens on the 'login_success' event
  socket.on('login_success', function(data) {
    current_user = data.cur_user;
    console.log('The user: ' + data.cur_user + ' has succesfully logged in');
  });
  //listens on the 'login_attempt' event
  socket.on('login_attempt', function(data) {
    console.log("SERVER: A user is attempting to login");

    if (current_user == null) {
      dbClass.checkValidUser(data.username,data.password, socket);
    }
    else {
      socket.emit('login_result', {status: 'conc_user'});
    }
  });
  //Listens on the 'logout' event
  socket.on('logout', function(data) {
    current_user = null;
  });

}

//Manages all socket functions if the connection is the raspberry PI
function handle_PI(socket) {
  if (pi_socket == null) {
    console.log("SERVER: The raspberry PI has connected");
    pi_socket = socket;
    socket.emit('message', 'SERVER: Connection confirmed!');
  }

  //Listens on the 'message' event
  socket.on('message', function(message) {
    console.log("RASPBERRY: " + message);
  });

  //Listens on the 'disconnect' event
  socket.on('disconnect', function(socket) {
    pi_socket = null;
    console.log("SERVER: The raspberry PI has disconnected");
  });

  //Listens on the 'dex_test' event
  socket.on('dex_test', function(result) {
    if (result.type == 'request_results') {
      io.to(result.socketid).emit('dex_test', 'request_results');
    }
  });
  //Listens on the 'hearing_test_result' event
  socket.on('hearing_test_result', function(result) {
    if (result.type == 'total') {
      console.log('Recieved hearing test result. Sending to database');
      if (current_user == null) {
        console.log('CRITICAL ERROR: Please shut down the server and restart');
      }
      else {
        var hearing_to_db = {
          username: current_user,
          left_freq: result.left_freq,
          right_freq: result.right_freq
        }

        dbClass.inputTestInfo(hearing_to_db, 'hearing');
      }
    }
    else {
      io.to(result.socketid).emit('hearing_test_result', result);
    }

  });

  //Listens on the 'vision_test_result' event
  socket.on('vision_test_result', function(result) {
    if (result.type == 'score') {
      console.log(result.score);
      io.to(result.socketid).emit('vision_test_result', result);

      if (current_user == null) {
        console.log('CRITICAL ERROR: Please shut down the server and restart');
      }
      else {
        var vision_to_db = {
          username: current_user,
          score: result.score
        }
        dbClass.inputTestInfo(vision_to_db, 'vision');
      }
    }
  });

}

//Performs a legacy blink function
function blink(socket) {
  // console.log("SERVER: The HTML client has requested a blink");
  // if (pi_connected()) {
  //   pi_socket.emit('request', CONSTANTS.BLINK);
  //   console.log("SERVER: Blink request sent to raspberry PI");
  // }
  // else {
  //   socket.emit('message', 'SERVER: Error, the raspberryPI is not currently connected. ' +
  //                 'Please connect the PI and try again');
  //   console.log("SERVER: Error, the raspberry PI is not currently connected");
  // }

  //dbClass.inputTestInfo({username: 'testUser', left_freq: '1234', right_freq: '28562'}, 'hearing');
  //dbClass.inputTestInfo({username: 'testUser', score: 1}, 'vision');
  //dbClass.inputTestInfo({username: 'testUser', score: '30'}, 'reflex');
  dbClass.sendUserTests('guowen',null);
}

//Checks if the a socket is currently associated with the PI
function pi_connected() {
  if (pi_socket == null) {
    return false;
  }
  else {
    return true;
  }
}

/**********************************************************************************/
/*The following are all database functions which interact directly with the html webpages.
As such they need access to the io socket connection. This is why these functions have been put in this file instead of dbClass.js
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

//Sends hearing scores of all users so a graph can be made
function getHearing(socketid){
    var con = makeAConnection();
            con.connect(function(err){

                if(err) throw err;

                var sql = "SELECT userName,L,R,dat from hearingInfo order by L DESC";
                var ret = con.query(sql, function(err,result) {
                    if(err) throw err;

                    var object = {
                        hearing:result
                    }
                    io.to(socketid).emit('graph_data',{test: 'hearing_test', data: object});
                });
  });
}
//Sends reflex scores of all users so a graph can be made
function getReflex(socketid){

    var con = makeAConnection();
            con.connect(function(err){

                if(err) throw err;

                var sql = "SELECT userName,rscore,dat from reflexInfo order by rscore DESC";
                var ret = con.query(sql,function(err,result) {
                    if(err) throw err;

                    var object = {
                        reflex:result
                    }
                    console.log(object);
                    io.to(socketid).emit('graph_data',{test: 'reflex_test', data: object});
                });
  });
}
//Sends vision information of all users so a graph can be made
function getVision(socketid){

    var con = makeAConnection();
            con.connect(function(err){

                if(err) throw err;

                var sql = "SELECT userName,vscore,dat from visionInfo order by vscore DESC";
                var ret = con.query(sql, function(err,result) {
                    if(err) throw err;

                    var object = {
                        vision:result
                    }
                    console.log(object);
                    io.to(socketid).emit('graph_data',{test: 'vision_test', data: object});
                });
  });
}

//Gives back age, height, weight, etc. of a certain user.
function getUserinfo(username,socketid){

  var con = makeAConnection();
  var con = makeAConnection();
  con.connect(function(err){

      if(err) throw err;

      var params = [username];

      //Gives back all combinations of rows from the tables, hearingInfo, reflexInfo, and visionInfo where the row has the desired username.
      var sql = "SELECT distinct visionInfo.username,visionInfo.vscore, hearingInfo.L,hearingInfo.R, reflexInfo.rscore, userinfo.firstName, userinfo.height, userinfo.weight, heartrate.heartrate from visionInfo inner join reflexInfo on visionInfo.username = reflexInfo.username inner join userinfo on visionInfo.username=userinfo.username inner join heartrate on visionInfo.username=heartrate.username inner join hearingInfo on visionInfo.username=hearingInfo.username where hearingInfo.username = ?";

      var ret = con.query(sql, params,function(err,result) {
          if(err) throw err;

          //rows with maximum vision scores
          var maxVscores=[];
          var maxv = 0;
          //rows with maximum vision and left hearing scores
          var maxLscores =[];
          var maxL = 0;

          //rows with maximum of all scores
          var max=[];
          var maxR = 0;

          //if there are results, then find the max scores

          if(result.length>0){
              //finds the rows with the highest vision score
              for(var i=0;i<result.length;i++){
                  if(maxv <= result[i]['vscore']){
                      maxv = result[i]['vscore'];
                  }
              }
              for(var i=0;i<result.length;i++){
                  if(maxv == result[i]['vscore']){
                      maxVscores.push(result[i]);
                  }
              }

              //finds rows with the highest left hearing scores (decided to check only left ear for hearing scores)
              for(var i=0;i<maxVscores.length;i++){
                  if(maxL <= maxVscores[i]['L']){

                      maxL = maxVscores[i]['L'];
                  }
              }
              for(var i=0;i<maxVscores.length;i++){
                  if(maxL == maxVscores[i]['L']){
                      maxLscores.push(maxVscores[i]);
                  }
              }

              //finds row with highest reflex score
              for(var i=0;i<maxLscores.length;i++){
                  if(maxR <= maxLscores[i]['rscore']){
                      maxR = maxLscores[i]['rscore'];
                  }
              }

              for(var i=0;i<maxLscores.length;i++){
                  if(maxR == maxLscores[i]['rscore']){
                      max.push(maxLscores[i]);
                  }
              }
              console.log("\n\nthis is max\n\n");
              console.log(max);
              io.to(socketid).emit('graph_data',{test: 'user_info', data: max});
          }
          else{
              //Send empty array max
              io.to(socketid).emit('graph_data',{test: 'user_info', data: max});          }
      });
});

//    var con = makeAConnection();
//            con.connect(function(err){
//
//                if(err) throw err;
//
//
//                var sql = "SELECT userName, age, height, weight from userinfo order by userName ASC ";
//                var ret = con.query(sql, function(err,result) {
//                    if(err) throw err;
//
//                    var object = {
//                        userStats:result
//                    }
//                    console.log(object);
//
//                    io.to(socketid).emit('graph_data',{test: 'user_info', data: object});  //change back!!
//                });
//  });
}
//Gives back all of a certain users sign up information.
function getUser(username,socketid){
    var con = makeAConnection();
            con.connect(function(err){

                if(err) throw err;

                var params = [username];

                var sql = "SELECT * from userinfo where userName = ? ";
                var ret = con.query(sql,params, function(err,result) {
                    if(err) throw err;

                    console.log(result);
                   io.to(socketid).emit('cur_user', result);
                });
  });
}
