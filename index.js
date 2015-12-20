var PORT = process.env.PORT || 9000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

io.on('connection',function (socket) {
	console.log('user connected via socket.io');

	socket.on('message',function (message) {
		console.log('Message recieved' + message.text);
		// socket.broadcast.emit('message',message);
		io.emit('message',{
			text:message.text,
			timestamp:moment().valueOf()
		});
	});

	socket.emit('message',{
		text: 'Welcome to the chat application!',
		timestamp:moment().valueOf()
	});
});


http.listen(PORT ,function () {
	console.log('server started');
});