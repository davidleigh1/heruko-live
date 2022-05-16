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
[ ] Host + Github deployment
[ ] Staging + Production hosting
[ ] Bootstrap
[ ] Toast notifications
[ ] Icons 
[X] Broadcast a message to connected users when someone connects or disconnects.
[ ] Create a centralized list of IDs/sockets so when connecting/disconnecting we keep the same name
[ ] Broadcast a message to connected users with the name of the user connecting or disconnecting (perhaps color icon in list)
[ ] Add support for nicknames.
[ ] Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she presses enter.
[ ] Add “{user} is typing” functionality.
[ ] Show who’s online.  List with status icons?
[ ] Add private messaging.
[ ] History and reload on refresh
*/ 

io.on('connection', (socket) => {
    const connection_msg = 'User connected';
    console.log(connection_msg);
    io.emit('info_message', connection_msg);
    socket.on('disconnect', () => {
        const disconnection_msg = 'User disconnected';
        console.log(disconnection_msg);
        io.emit('info_message', disconnection_msg);
    });
    socket.on('chat_message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat_message', msg);
    });
});


/* ROUTER PAGES */

var routes = require('./routes');
app.use('/', routes);

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