var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();

var Game = require("../models/game").game;
var Player = require("../models/player").player;

var util = require('util');


/* GET home page. */
router.get('/', function (req, res) {
  var game = new Game();
  res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

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

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
		console.log('Hola estoy en login');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


router.get('/newgame',function(req,res){
    res.render('newgame');
});


//creamos un inicio de nuevo juego
router.post('/newgame', function(req,res){
		console.log("Hola estoy en el nuevo juego");
    var p1 = new Player ({name : req.body.Player1});
    var p2 = new Player ({name : req.body.Player2});
		p1.save();
		p2.save();
    var g = new Game ({name : req.body.GameName, player1 : p1 , player2 : p2, currentHand: p1});
    g.save(function (err, game){
        if(err){
            console.log(err);
        }  
        Game.findOne({name:game.name},function(err,result){ 
            console.log(result); 
        });
        console.log(p1.name);
        console.log(p2.name);
         res.redirect('/play?gameid=' + game._id);
    });
});

router.get('/play',function(req,res){
		var g = Game.findOne({_id:req.query.gameid},function(err,game){
				var pepe = game.newRound();

				pepe.save();
console.log(util.inspect(pepe, {showHidden: false, depth: 12}));

        console.log(pepe.currentRound);
        //res.render('play', {g : game});
    });
				
	/*	var r = new Round(g,1)
    g = Game.update({_id: req.query.gameid}, {$push: {"rounds": r}})
		g = Game.update({_id: req.query.gameid}, )*/
		//g.newRound();

    res.render('play');
}); 

//router.post('/play', function(req,res){


router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
