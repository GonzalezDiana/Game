var express = require('express');
var passport = require('passport');
var router = express.Router();

//Models
var User = require('../models/user');
var Game = require("../models/game").game;
var Player = require("../models/player").player;
var Round = require("../models/round").round;
var Card = require("../models/card").card;
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");

var util = require('util'); //Esta librería la uso para mostrar algunas cosas


/* GET home page. */
router.get('/', function (req, res) {
  var game = new Game();
  res.render('index', { user : req.user });
});

/* GET register page.*/
router.get('/register', function(req, res) {
    res.render('register', { });
});

/* POST register page */
router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

/* GET login page. */
router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

/* POST login page. */
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

/* GET logout page. */
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/* GET newgame page. */
router.get('/newgame',function(req,res){
    res.render('newgame');
});


/* POST newgame page. */
router.post('/newgame', function(req,res){
  var p1 = new Player ({name : req.body.Player1});
  var p2 = new Player ({name : req.body.Player2});
  p1.save();
  p2.save();
  var g = new Game ({name : req.body.GameName, player1 : p1 , player2 : p2, currentHand: p1});
  g.save(function (err, game){
    if(err){
      console.log(err);
    }  
    /*Game.findOne({name:game.name},function(err,result){ 
        console.log(result); 
      });
      console.log(p1.name);
      console.log(p2.name); */
    res.redirect('/play?gameid=' + game._id);
  });
});

/* GET play page. */
router.get('/play',function(req,res){
  var g = Game.findOne({_id:req.query.gameid},function(err,game){
  game.newRound();
  console.log("Nombre: " + game.player1.name);
  console.log(game.player1.cards);
  console.log("Puntos del envido: " + game.player1.envidoPoints);
  game.save(function (err, game) {
    if(err){
      console.log("Aca tenemos el error de recursividad.");
      console.log(err);
    }  
   });
    //console.log(util.inspect(game, {showHidden: false, depth: 12}));
    //console.log("currentRound " + game.currentRound.currentTurn);
  res.render('play', {g : game});
  });
}); 


/* POST play page. */
router.post('/play', function(req,res){
	//console.log("Hola, estoy dentro del post de play");
	Game.findOne({_id:req.body.gameid}, function(err,game){
		//console.log(util.inspect(game, {showHidden: false, depth: 12}));
  	//var round = game.currentRound;
		//----
  });
}); 

/* GET ping page. */
router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
