console.log("==> Loading gameController.js");

const path = require('path');

module.exports = {
    getGame : function(req, res){
      //  console.log(res);
         res.json({ 'success' : true, 'route': 'GET' });
    },
    getGames : function(req, res){
         res.send('<p>This is the main games (list) page</p><p><a href="/">Back home</a></p>');
    },
    postGame : function(req, res){
         // res.json({ 'success' : true });
         res.json({ 'success' : true, 'route': 'POST' });

    },
    getConnect : function(req, res){
         const full_path = path.join(__dirname, './connect/index.html');
         console.log("getConnect - path:",full_path);
     // res.sendFile(path.join(__dirname, '/index.html'));
     res.sendFile(full_path);
    }
}


