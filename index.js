var PORT = process.env.PORT || 9000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clientInfo={};

io.on('connection',function (socket) {
	console.log('user connected via socket.io');

	socket.on('joinRoom',function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		io.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined the room!',
			timestamp: moment().valueOf()
		});
	});

	socket.on('message',function (message) {
		console.log('Message recieved ' + message.text);
		// socket.broadcast.emit('message',message);
		message.timestamp = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	socket.emit('message',{
		text: 'Welcome to the chat application!',
		timestamp:moment().valueOf(),
		name:'System'
	});
});


http.listen(PORT ,function () {
	console.log('server started');
});