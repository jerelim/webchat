var socket = io();
// handles submitting of new message
var name, room;
var $form = $('#message-form');
room = getQueryVariable('room') || "Default";
name =getQueryVariable('name') || "Anon";

$('#room-name').text( $('#room-name').text() + ": " + room );


$.get( './messages/' + room, function( data ) {
	// if there is no error message inside the data
	if (!data.hasOwnProperty('error')) {
		// loop through each message
		var $messages = $('#chat');
		data.forEach(function (message) {
			// console.log(message);
			var timestampMoment= moment.utc(parseInt(message.timestamp)).local().format('LT');
			var $message= $('<li class = "list-group-item "> </li>');
			$message.prepend("<p>" + message.text + "</p>");
			$message.prepend("<p><b>" + message.name + ' @ ' + timestampMoment + " : </b></p>");

			$messages.prepend($message);
		});
	}
}, "json" );

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
			name:name,
			room:room
		});
		$form.find('input[name=message]').val(''); 
	}
});

