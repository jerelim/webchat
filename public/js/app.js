var socket = io();
// handles submitting of new message
var name, room;
var $form = $('#message-form');
room = getQueryVariable('room') || "";
name =getQueryVariable('name') || "Anon";

socket.on('connect',function () {
	console.log('connected to socket.io server!');
});

socket.on('message',function (message) {
	// console.log('new message');
	var timestampMoment= moment.utc(message.timestamp).local().format('LT');
	var chat = $('#chat');
	chat.prepend("<p>" + message.text + "</p>");
	chat.prepend("<p><b>" + message.name + ' @ ' + timestampMoment + " : </b></p>");
});


$form.on('submit',function (event) {
	event.preventDefault();
	socket.emit('message',{
		text:$form.find('input[name=message]').val(),
		name:name,
		room:room
	});
	$form.find('input[name=message]').val(''); 
});

