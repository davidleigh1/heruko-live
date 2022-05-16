console.log("==> Loading rootController.js");

module.exports = {
    getHome : function(req, res){
        res.send('<p>Hi - this is our GAMES home page!</p><p><a href="/about">About</a> | <a href="/games">Games</a></p>');
    },
    getAbout : function(req, res){
        res.send('<p>ABOUT PAGE!</p><p><a href="/">Home</a> | <a href="/games">Games</a></p>');
    },
    getChat : function(req, res){
        res.sendFile(__dirname + '/chat/index.html');
    },
}