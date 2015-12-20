var socket = io();

socket.on('connect',function () {
	console.log('connected to socket.io server!');
});

socket.on('message',function (message) {
	console.log('new message');
	console.log(message.text);
	$('#chat').prepend("<p>" + message.text + "</p>");
});

// handles submitting of new message
var $form = $('#message-form');

$form.on('submit',function (event) {
	event.preventDefault();
	socket.emit('message',{
		text:$form.find('input[name=message]').val() 
	});
	$form.find('input[name=message]').val(''); 
});