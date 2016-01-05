var socket = io();
// handles submitting of new message
var name, room;
var $form = $('#message-form');
room = getQueryVariable('room') || "Default";
name =getQueryVariable('name') || "Anon";

$('#room-name').text( $('#room-name').text() + ": " + room );

socket.on('connect',function () {
	console.log('connected to socket.io server!');
	socket.emit('joinRoom',{
		name:name,
		room:room
	});
});

socket.on('message',function (message) {
	// console.log('new message');
	var timestampMoment= moment.utc(message.timestamp).local().format('LT');
	var $messages = $('#chat');
	var $message= $('<li class = "list-group-item "> </li>');

	$message.prepend("<p>" + message.text + "</p>");
	$message.prepend("<p><b>" + message.name + ' @ ' + timestampMoment + " : </b></p>");
	$messages.prepend($message);
});


$form.on('submit',function (event) {
	event.preventDefault();
	if ($form.find('input[name=message]').val().trim().length > 0 ) {
		socket.emit('message',{
			text:$form.find('input[name=message]').val(),
			name:name
		});
		$form.find('input[name=message]').val(''); 
	}
});

