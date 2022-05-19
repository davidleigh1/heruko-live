//  nodemon app.js

console.log("==> Loading Games > app.js");

/* SET UP SERVER - Source: https://socket.io/get-started/chat */

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
// const io = new Server(server);


/* Source: https://socket.io/docs/v4/server-options/ */
/* Source: https://stackoverflow.com/questions/25896225/how-do-i-get-socket-io-running-for-a-subdirectory */
// import { createServer } from "http";
// import { Server } from "socket.io";

// const server = createServer();
const io = new Server(server, {
  path: "https://tlv.works/live/socket.io/"
});

console.log("SOCKET.IO custom path: ","/live/socket.io/");


/*
[X] Host + Github deployment
[ ] Staging + Production hosting
[-] Bootstrap
[X] Toast notifications
[ ] Icons 
[X] Broadcast a message to connected users when someone connects or disconnects.
[X] Create a centralized list of IDs/sockets so when connecting/disconnecting we keep the same name
[ ] https://riptutorial.com/socket-io/example/30273/example-server-side-code-for-handling-users
[ ] Broadcast a message to connected users with the name of the user connecting or disconnecting (perhaps color icon in list)
[ ] Add support for nicknames.
[ ] Don’t send the same message to the user that sent it. Instead, append the message directly as soon as he/she presses enter.
[ ] Add “{user} is typing” functionality.
[ ] Show who’s online.  List with status icons?
[ ] Add private messaging - user specific messaging.
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

const sockets = io.fetchSockets();

io.on('connection', (socket) => {
    const connection_msg = "Connection detected on socket: " + socket.id;
    console.log(connection_msg);
    console.log("Checking for matching users on that socket...");

    // logConnection(socket.id);
    // io.emit('info_message', connection_msg);
    io.emit("notify", {'type':'notify', 'level': 'info', 'dest':'all', 'content': connection_msg, 'happened_at': socket.handshake.issued, 'query': socket.handshake.query} );
    
    console.log("Current users",users,"Total users:",Object.keys(users).length, "\n\n");
    getUsersArray(users);

    socket.on('disconnect', () => {
        console.log("Disconnection detected on socket:",socket.id);

        // TODO: What if returns 0 or >1 ?
        const disconnectedUserObj = findUsers("socket_id", socket.id)[0] || {};

        const disconnection_msg = "User '"+disconnectedUserObj.user_name+"' disconnected";

        // TODO: Remove from users list on disconnection or on leave?
        console.log(disconnection_msg, "on socket: '"+ socket.id + "'. Total users:",Object.keys(users).length,"");
        

        // io.emit('info_message', disconnection_msg);
        io.emit("notify", {'type':'notify', level: 'warning', 'dest':'all', 'content': disconnection_msg} );
    });

    socket.on('client_connection', (settingsObj) => {
        console.log('\n\n==> client_connection:\n', settingsObj);

        console.log("Assiging username: '",settingsObj.user_name,"' to socket.data.username for socket:", socket.id);
        socket.data.username = settingsObj.user_name;

        // logConnection(settingsObj);

        /* Confirm if we recognize this user */
        if ( !users[settingsObj.user_id] ){
            console.log("User not found in users{} with UUID:",settingsObj.user_id);
            const newUser = logNewUser(settingsObj);

            /* Prepare chat_message */
            const msg_obj = {};
            msg_obj.msg_id = getUUID();
            msg_obj.sender_id = 'system';
            msg_obj.sender_name = 'System';
            msg_obj.dest_id = null;
            msg_obj.msg_type = 'chat_message';
            msg_obj.content = "<span class=\"joined inline-username\">" + newUser.user_name + "</span> has joined! ("+newUser.socket_id+")";
            msg_obj.happened_at = new Date().toISOString();
            msg_obj.is_history = false;

            /* Add list of users in this chat */
            const arrayOfUsernames = findUsers("user_name",null,"user_name").sort();
            msg_obj.content += "<br>Now in chat ("+arrayOfUsernames.length+"): <span class=\"inline-username\">" + arrayOfUsernames.join("</span>, <span class=\"inline-username\">") + "</span>";


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

            const reconnection_msg = "User '"+ users[settingsObj.user_id].user_name +"' is back! ("+users[settingsObj.user_id].socket_id+")";
            io.emit("notify", {'type':'notify', level: 'success', 'dest':'all', 'content': reconnection_msg} );



        }
        console.log("\n-------------\nUsers",users,"Total users:",Object.keys(users).length,"\n-------------\n");

    });

        // socket.on("hello", (arg, callback) => {
        //     console.log(arg); // "world"
        //     callback("got it");
        //   });

    socket.on("chat_message", (msg_obj, callback) => {
        console.log("New Incoming Message from '" + socket.data.username + "':", msg_obj);
        callback("Server says 'got it' msg_id:"+msg_obj.msg_id);
        // console.log("New Incoming Message from '"+msg_obj.sender_name+"': " + msg_obj.content);
        io.emit('chat_message', msg_obj);
        // TODO: Add green tick on confirmed receipt from all users 
    });
});


/* ROUTER PAGES */

var routes = require('./routes');
app.use('/', routes);

app.use(express.static('public'));

// server.listen(3001, () => {
//     console.log('Server ready - listening on *:3001');
// });

const myPort = process.env.PORT || 3001;
server.listen(myPort, function (){
  console.log("Calling app.listen's callback function...");
  const host = server.address().address;
  const port = server.address().port;
  console.log('> Server ready - listening at Host: [', host,'] and Port:[', port,']');
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

    return uuidv4();
    /* Fallback... */
    // return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        // (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    // );
}

function findUsers(matchKey, matchValue, returnKey) {
    matchingUsers = [];
    // matchKey = "socket_id";
    // matchValue = "o1vmmbCbbxEK1q-7AAAS";

    for (let userKey in users) {
    // console.log(`users.${prop} = ${users[prop]}`);
    
        for (let [key, value] of Object.entries(users[userKey])) {
        // console.log(userKey, "---->", key, ":" , value);
        
            if (key == matchKey){
                console.log(userKey, "---->", key, ":" , value);
                if (key == matchKey && value.toLowerCase() == matchValue){
                    // Exact non-case-specific match
                    // If matchvalue = "", we will match users without a value
                    console.log("Match!");
                    matchingUsers.push(users[userKey]);
                }
                if (key == matchKey && matchValue == undefined){
                    // console.log("return all with this key existing");
                    // matchingUsers.push(users[userKey]);
                    returnOnlyRequestedElem(users[userKey])
                }
            }
        }
        
        // console.log(users[prop]);
    }

    function returnOnlyRequestedElem(userObjectToReturn){
        if (!returnKey){
            matchingUsers.push(userObjectToReturn);
        } else {
            matchingUsers.push(userObjectToReturn[returnKey]);
        }
    }
    console.log("Found " + matchingUsers.length + " users:", matchingUsers);
    return matchingUsers;
}

function getUserRooms(userId) {
    
}

function getUsersArray(users) {
    const count = io.engine.clientsCount;
    // may or may not be similar to the count of Socket instances in the main namespace, depending on your usage
    const count2 = io.of("/").sockets.size;

    // const socketsArray = io.fetchSockets();
    // const socketsArray = io.of("/").sockets;

    console.log("---- getUsersArray() ------------------");
    console.log("Users Array:", Object.keys(users).length);
    console.log("io.engine.clientsCount:", count);
    console.log("socket instances in namespace:", count2);
    console.log("Sockets:",sockets.length,Object.keys(sockets).length)

    console.log("io.sockets.adapter.rooms:\n",io.sockets.adapter.rooms);
    // console.log(io.socket.rooms);
    // console.log(socket.rooms);

    // console.log("From io.fetchSockets() count:", Object.keys(socketsArray).length );
    // for (const socket of socketsArray) {
    //     console.log("---------");
    //     console.log(socket.id);
    //     console.log(socket.handshake);
    //     console.log(socket.rooms);
    //     console.log(socket.data);
    //     console.log("---------");
    //     // socket.emit(/* ... */);
    //     // socket.join(/* ... */);
    //     // socket.leave(/* ... */);
    //     // socket.disconnect(/* ... */);
    // }

    console.log("---------------------------------------");

}
