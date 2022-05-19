console.log("==> Loading routes.js");

const express = require('express');
const path = require('path');
const router = express.Router();

// const gameCtrl = require('./gameController');
const rootCtrl = require('./rootController');


router.route('/').get(rootCtrl.getHome);
router.route('/about').get(rootCtrl.getAbout);
router.route('/socket').get(rootCtrl.getSocket);
router.route('/chat').get(rootCtrl.getChat);
// router.route('/socket.io').get(rootCtrl.getSocket);

// router.route('/games').get(gameCtrl.getGames);
// router.route('/games/list').get(gameCtrl.getGames);
// router.route('/game').get(gameCtrl.getGame);
// router.route('/game').post(gameCtrl.postGame);

// router.route('/games/connect').get(gameCtrl.getConnect);

// const path = require('path');
router.use(express.static(path.join(__dirname, 'public')));

// router.use(express.static(path.join(__dirname, 'public')));

// router.use(express.static('public'))


module.exports = router;