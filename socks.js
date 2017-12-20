const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;
const users = {};
const colors = {};
const status = {};
const avatars = {};

io.on('connection', socket => {
  socket.broadcast.emit('new connection',"A new user connected.\n");  
  socket.on('new user',(data, callback) => {
    if (data.nick in users){
        callback(false);
    }
    else {
        socket.nickname = data.nick;
        users[socket.nickname]=socket;
        socket.color = data.color;
        colors[socket.nickname]=socket.color;
        socket.ava = data.ava;
        avatars[socket.nickname]=socket.ava;
        updateUsers(status,avatars,colors);
        callback(true);
    }
  });
  socket.on('chat message', (data) => {
    msg = data.trim();  
    const pattern = new RegExp("^(https:\/\/www.|http:\/\/www.|www.|https:\/\/|http:\/\/)?([a-z0-9]+[-.]{1})+([a-z0-9]+)*(\.[a-z]{2,5})+(\/.*)?$","gmi");
    if(msg.substr(0,3)==="/w "){
        msg = msg.substr(3);
        const ind = msg.indexOf(' ');
        if(ind!=-1) {
            const name = msg.substr(0,ind);
            msg = msg.substr(ind+1).trim();
            if (name in users){
                dm = users[name];
                dm.emit('whisper', {'message':msg,'nick':socket.nickname});
            }
            else {
                socket.emit("custom_error","That username does not exist.");
            }
        }
        else {
            socket.emit("custom_error","Error. Enter a message for the whisper. Forgot the spaces maybe? :P");
        }
    }
    else if(msg.substr(0,3)==="/s "){
        msg = msg.substr(3).trim();
        if(msg.length>0) {
            status[socket.nickname] = msg;
            updateUsers(status,avatars,colors);
        }
        else {
            socket.emit("custom_error","Error. Enter a status.");
        }
    }
    else if(msg.substr(0,7)==="/clear"){
        socket.emit("clear","");
    }
    else if (pattern.test(msg)) {
        var request = require('request');
        request.head(msg, (error, response, body)=> {
            if(response && (response.statusCode===200||response.statusCode===304) && !(response.headers['x-frame-options'])){
                if (msg.startsWith('http') && !(msg.startsWith('https'))) {
                    msg = msg.replace('http','https');
                    io.emit('embed message', {'message':msg,'nick':socket.nickname,'color':socket.color,'ava':socket.ava});
                }
                else if (msg.startsWith('https')) {
                    io.emit('embed message', {'message':msg,'nick':socket.nickname,'color':socket.color,'ava':socket.ava});
                }
                else {
                    msg = 'https://'+msg;
                    io.emit('embed message', {'message':msg,'nick':socket.nickname,'color':socket.color,'ava':socket.ava});
                }
            }
            else if (response&&response.headers['x-frame-options']){
                io.emit('custom_error',"Sorry, that site prevents embedding.")
            }
            else {
                io.emit('embed message', {'message':"404.html",'nick':socket.nickname,'color':socket.color,'ava':socket.ava});
            }
        });
    }
    else {
        io.emit('send message', {'message':msg,'nick':socket.nickname,'color':socket.color,'ava':socket.ava});
    }
  });
  socket.on('disconnect',() => {
    socket.broadcast.emit('bye user',"A User disconnected.\n");
    if(!socket.nickname) return;
    delete status[socket.nickname];
    delete users[socket.nickname];
    delete colors[socket.nickname];
    delete avatars[socket.nickname];
    updateUsers(status,avatars,colors);
  });
  function updateUsers(status,avatars,colors){
    Object.keys(users).forEach(key=>status[key]=status[key]!==undefined?status[key]:"");
    const statusList = Object.keys(status).map(key=>status[key]);
    const avatarsList = Object.keys(avatars).map(key=>avatars[key]);
    const colorsList = Object.keys(colors).map(key=>colors[key]); 
    io.emit('usernames',{"nickList":Object.keys(users),"colorsList":colorsList,"statusList":statusList,"avatarsList":avatarsList});
  }
});

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});