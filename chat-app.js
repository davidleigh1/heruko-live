// // const server = require('./app.js').Server;

// //TODO: Need the correct way to overcome: "ReferenceError: server is not defined"
// const server = require('./app.js').server;

// const { Server } = require("socket.io");
// const io = new Server(server);

// io.on('connection', (socket) => {
//     console.log('-> User connected');
//     socket.on('disconnect', () => {
//       console.log('<- User disconnected');
//     });
//     socket.on('chat_message', (msg) => {
//         console.log('Message: ' + msg);
//         io.emit('chat_message', msg);
//     });
// });

// module.exports = io;