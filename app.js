var express = require('express');
app=express();
var server=require('http').Server(app);
io=require('socket.io')(server);
usernames=[];


app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});

io.on('connection', function (socket) {
	socket.on('new user',function (data,callback){
		if(usernames.indexOf(data) != -1){
			console.log('Username already taken!');
			callback(false);
		} else {
			socket.username=data;
			usernames.push(socket.username);
			updateUsernames();
			console.log(usernames);
			callback(true);
		}
	});

	function updateUsernames(){
		io.emit('usernames',usernames);
	}

	//Send message
	socket.on('send message', function (msg) {
  		io.emit('send message',{msg, user:socket.username});
  	});

  	socket.on('disconnect', function(data){
  		if(!socket.username){
  			return; 
  		}
  		usernames.splice(usernames.indexOf(socket.username, 1));
  		updateUsernames();
  		console.log('user disconnected');
  	});
});



server.listen(process.env.PORT || 3000);