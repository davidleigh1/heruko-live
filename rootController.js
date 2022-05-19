console.log("==> Loading rootController.js");

module.exports = {
    getHome : function(req, res){
        res.send('<p>Hi - this is our LIVE home page!</p><p><a href="/about">About</a> | <a href="/chat">CHAT</a></p>');
    },
    getAbout : function(req, res){
        res.send('<p>ABOUT PAGE!</p><p><a href="/">Home</a> | <a href="/games">Games</a></p>');
    },
    getSocket : function(req, res){
        res.send('Your request ended up here!');
    },
    getChat : function(req, res){
        res.sendFile(__dirname + '/chat/index.html');
    },
}