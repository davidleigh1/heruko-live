//  nodemon app.js

console.log("==> Loading Games > app.js");

/* SET UP SERVER - Source: https://socket.io/get-started/chat */

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


/*
[X] Host + Github deployment
[ ] Staging + Production hosting
[-] Bootstrap
[X] Toast notifications
[ ] Icons 
[X] Broadcast a message to connected users when someone connects or disconnects.
[ ] Create a centralized list of IDs/sockets so when connecting/disconnecting we keep the same name
[ ] https://riptutorial.com/socket-io/example/30273/example-server-side-code-for-handling-users
[ ] Broadcast a message to connected users with the name of the user connecting or disconnecting (perhaps color icon in list)
[ ] Add support for nicknames.
[ ] Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she presses enter.
[ ] Add “{user} is typing” functionality.
[ ] Show who’s online.  List with status icons?
[ ] Add private messaging.
[ ] History and reload on refresh
*/ 

const users = {};

function logConnection(user_id) {

    /* Confirm if we recognize this user */

    if (!users[user_id]){
        console.log("User not found!",user_id);
        logNewUser(user_id);
    } else {
        console.log("User found!",user_id);
        users[user_id].last_connected_at = new Date();
    }
}

function logNewUser(user_id){
    const user = {};
    user.id = user_id;
    user.socket_id = user_id;
    user.first_connected_at = new Date();
    users[user_id] = user;
}

io.on('connection', (socket) => {
    const connection_msg = "User '" + socket.id + "' connected at " + socket.handshake.issued;
    console.log(connection_msg, socket.id);
    logConnection(socket.id);
    io.emit('info_message', connection_msg);
    io.emit("notify", {'type':'notify', 'level': 'info', 'dest':'all', 'content': connection_msg, 'happened_at': socket.handshake.issued, 'query': socket.handshake.query} );
    console.log("Users",users);
    socket.on('disconnect', () => {
        const disconnection_msg = 'User disconnected';
        console.log(disconnection_msg);
        io.emit('info_message', disconnection_msg);
        io.emit("notify", {'type':'notify', level: 'warning', 'dest':'all', 'content': disconnection_msg} );
    });
    socket.on('chat_message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat_message', msg);
    });
});


/* ROUTER PAGES */

var routes = require('./routes');
app.use('/', routes);

app.use(express.static('public'));

server.listen(3001, () => {
    console.log('Server ready - listening on *:3001');
});



// const app = require('./routes');


// app.use("/test/", routes);


/* FUNCTIONS */

const Fs = require('fs')

function lastUpdatedDate (file) {  
  const { mtime, ctime } = Fs.statSync(file);

  console.log(`File data for app.js - last modified: ${mtime}`);
  // console.log(`File status last modified: ${ctime}`);

  return mtime
}

/* RUNTIME */

// const cars = require('./vars').cars;
// const bikes = require('./vars').bikes;
// const buses = require('./vars').buses;

// if (typeof cars == "object"){
//     console.log("Cars found!", typeof cars, cars);
// } else {
//     console.log("Cars is not defined!", typeof cars);
// }

// if (typeof bikes == "object"){
//     console.log("Bikes found!", typeof bikes, bikes);
// } else {
//     console.log("Bikes is not defined!", typeof bikes);
// }

// if (typeof buses == "object"){
//     console.log("Buses found!", typeof buses, buses);
// } else {
//     console.log("Buses is not defined!", typeof buses);
// }


/* Source: https://getbootstrap.com/docs/5.2/getting-started/download/#npm */
// const bootstrap = require('bootstrap');

