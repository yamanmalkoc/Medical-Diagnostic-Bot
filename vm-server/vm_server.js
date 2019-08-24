var CONSTANTS = require('../shared/constants');
var http = require('http');
var fs   = require('fs');


const PORT = 80;

/* Source: https://openclassrooms.com/en/courses/2504541-ultra-fast-applications-using-node-js/2505653-socket-io-let-s-go-to-real-time
 */
var pi_socket = null;

//Loading the index file .html displayed to the client
var server = http.createServer(function(req, res) {
  fs.readFile('./index.html', 'utf-8', function(error, content) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(content);
  });
});

//Loading socket.io
var io = require('socket.io').listen(server);

//Loading socket.io
io.sockets.on('connection', function(socket) {
  if (socket.request.connection.remoteAddress == CONSTANTS.RP_IP) {
    console.log("The raspberry PI has connected!");
    pi_socket = socket;
    socket.emit('message', 'The server has confirmed connection');
  }
  else {
    console.log("A HTML client has connected");
  }
  socket.on('message', function(message) {
    console.log('The client has a message: ' + message);
  })


  socket.on('request', function(message) {
    if (message == 'blink') {
      console.log("The HTML client has requested a blink")
      if (pi_socket != null) {
        pi_socket.emit('request', 'blink');
      }
    }
  });
});




server.listen(PORT);


// fs.readFile('./index.html', function(err, html) {
//
//   if (err) throw err;
//
//   //create a server object:
//   http.createServer(function (req, res) {
//     res.writeHeader(200, {"Content-Type": "text/html"});
//     res.write(html); //write a response to the client
//     res.end(); //end the response
//   }).listen(PORT); //the server object listens on port 8080
// });
