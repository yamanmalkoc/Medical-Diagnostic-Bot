var io = require('socket.io-client');
var isProcessRunning = false;
var currentProcess = null;
var socket = io.connect('http://cpen291-5.ece.ubc.ca');

socket.on('message', function(message) {
		console.log(message);
	})
	

socket.on('request', function(message) {
		if (message == 'blink') {
			console.log('Recieved a blink request from the server');
			isProcessRunning = true;
			blink(socket);
		}else if(message == 'cancel'){
			console.log('Cancelling current process');
			cancelProcess();
		}
	})


function blink(socket) {
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python', ["blink.py"]);
	currentProcess = pythonProcess;
	pythonProcess.stdout.on('data', (data)=>{
		console.log(data.toString());
		socket.emit('message', 'Blink has finished');
		isProcessRunning = false;
	});
}

/*
 * Kills the current running process, sets the isProcessRunning flag to false.
 */
function cancelProcess(){
	currentProcess.kill();
	isProcessRunning = false;
}
