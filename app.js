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

/* src: https://www.npmjs.com/package/uuid  */
const { v4: uuidv4 } = require('uuid');

// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const users = {};

function logNewUser(userObj){
    console.log("LOGGING NEW USER!");
    const user = {};
    user.user_id = userObj.user_id;
    user.user_name = userObj.user_name;
    user.socket_id = userObj.socket_id;
    user.first_connected_at = new Date().toISOString();
    user.last_connected_at = new Date().toISOString();
    users[user.user_id] = user;
    return users[user.user_id];
}

io.on('connection', (socket) => {
    const connection_msg = "Connection detected on socket: '" + socket.id + "' at " + new Date(socket.handshake.issued);
    console.log(connection_msg, socket.id);
    // logConnection(socket.id);
    io.emit('info_message', connection_msg);
    io.emit("notify", {'type':'notify', 'level': 'info', 'dest':'all', 'content': connection_msg, 'happened_at': socket.handshake.issued, 'query': socket.handshake.query} );
    
    console.log("Current users",users,"Total users:",Object.keys(users).length, "\n\n");

    socket.on('disconnect', () => {
        const disconnection_msg = 'User disconnected';
        console.log(disconnection_msg, "on socket: '"+ socket.id + "'. Total users:",Object.keys(users).length,"");
        io.emit('info_message', disconnection_msg);
        io.emit("notify", {'type':'notify', level: 'warning', 'dest':'all', 'content': disconnection_msg} );
    });

    socket.on('client_connection', (settingsObj) => {
        console.log('\n\n==> client_connection:\n', settingsObj);

        // logConnection(settingsObj);

        /* Confirm if we recognize this user */
        if ( !users[settingsObj.user_id] ){
            console.log("User not found!",settingsObj.user_id);
            const newUser = logNewUser(settingsObj);

            /* Prepare chat_message */
            const msg_obj = {};
            msg_obj.msg_id = getUUID();
            msg_obj.sender_id = 'system';
            msg_obj.sender_name = 'System';
            msg_obj.dest_id = null;
            msg_obj.msg_type = 'chat_message';
            msg_obj.content = newUser.user_name + " has joined! ("+newUser.socket_id+")";
            msg_obj.happened_at = new Date().toISOString();
            msg_obj.is_history = false;

            io.emit("chat_message", msg_obj);

        } else {
            console.log("User found!",settingsObj.user_id);
            // users[settingsObj.user_id].last_connected_at = new Date();

        // if ( !users[settingsObj.socket_id] ){
        //     console.error("USER NOT FOUND!", settingsObj);
        // } else {
            users[settingsObj.user_id].user_name = settingsObj.user_name;
            users[settingsObj.user_id].socket_id = settingsObj.socket_id;
            users[settingsObj.user_id].last_connected_at = new Date().toISOString();
        }
        console.log("\n-------------\nUsers",users,"Total users:",Object.keys(users).length,"\n-------------\n");

    });

    socket.on('chat_message', (msg, msg_obj) => {
        console.log("New Incoming Message from '"+msg_obj.sender_name+"': " + msg_obj.content);
        io.emit('chat_message', msg_obj);
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

/* Helper Functions */

function getUUID() {

    if (!!crypto.randomUUID) {
        /* Not supported in all browers */
        return crypto.randomUUID();
    } else {
        /* Fallback... */
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}