var PORT = process.env.PORT || 9000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var db= require('./db.js');

app.use(express.static(__dirname + '/public'));

var clientInfo={};

// GET /messages/room
app.get('/messages/:room', function (req, res) {
    var room = req.params.room;
    var where = {room:room};
    db.message.findAll({where : where}).then(function (messages) {
    	if (messages.length > 0) {
    		res.json(messages);
    	} else{
    		res.status(404).json({error:'no results found'});
    	}
    },function (error) {
    	res.status(500);
    });
});

// sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];
	
	// returns if no info exists
	if (typeof info ==='undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message',{
		name:'System',
		text:'Current users: ' + users.join(', '),
		timestamp: moment().valueOf()
	});
}

io.on('connection',function (socket) {
	console.log('user connected via socket.io');

	socket.on('disconnect',function () {
		if (typeof clientInfo[socket.id] !=='undefined') {
			socket.leave(clientInfo[socket.id]);
			io.to(clientInfo[socket.id].room).emit('message', {
				name: 'System',
				text: clientInfo[socket.id].name + ' has left the room!',
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

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
		if (message.text === "@users") {
			sendCurrentUsers(socket);
		}else{
			// send default code
			message.timestamp = moment().valueOf();
			// broadcast the message
			io.to(clientInfo[socket.id].room).emit('message', message);
			// insert the message to the db , dont care bout return promise for now
			db.message.create(message);
		}
	});

	socket.emit('message',{
		text: 'Welcome to Jweb chat! <br> Use @users to view all users in the room',
		timestamp:moment().valueOf(),
		name:'System'
	});
});



db.sequelize.sync().then(function () {

	http.listen(PORT ,function () {
		console.log('server started');
	});
	
});