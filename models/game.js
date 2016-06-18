/* Define the model game. */
var _ = require('lodash');
var playerModel = require('./player');
var deckModel = require('./deck');
var cardModel = require('./card');
var roundModel = require('./round');

/** MONGOOSE **/
var mongoose = require('mongoose');
var db= mongoose.createConnection('mongodb://localhost/Game');

db.on('error', console.error.bind(console, 'conection error'));
db.once('open', function(){
	console.log('We are connected!!!');
});

//db.game.remove();

var Player = playerModel.player;
var Round  = roundModel.round;

var ObjectId = mongoose.Schema.Types.ObjectId; //Para jugadores

/*Definimos el esquema de nuestro juego*/
var GameSchema = mongoose.Schema({
	name: String,
	//player1: {type: ObjectId, ref: 'Player'},
	//player2: {type: ObjectId, ref: 'Player'},
	player1: Object,
	player2: Object,
	rounds: {type: Array, default : [] },
	currentHand: String, //jugador
	//currentRound: {type: ObjectId, ref: 'Round'},
	currentRound : Object,
	score: {type: Array, default : [0,0] },

});

GameSchema.methods.newRound = function(){
   var round = new Round(this, this.currentHand);
   this.currentRound = round;
   this.currentHand = switchPlayer(this.currentHand);
   this.rounds.push(round);
	 console.log("Crea ronda " + this.rounds + " ronda " + this.currentRound.status);
	this.save();
   return this;
 }


var Game = mongoose.model('Game', GameSchema);
 /*
  * Check if it's valid move and play in the current round
  */
 Game.prototype.play = function(player, action, value){
   if(this.currentRound.currentTurn !== player)
     throw new Error("[ERROR] INVALID TURN...");
 
   if(this.currentRound.fsm.cannot(action))
     throw new Error("[ERROR] INVALID MOVE...");
 
   return this.currentRound.play(player, action, value);
 };
 
 /*
  * Create and return a new Round to this game
  */
 /*Game.prototype.newRound = function(){
   var round = new Round(this, this.currentHand);
   this.currentRound = round;
   this.currentHand = switchPlayer(this.currentHand);
   this.rounds.push(round);
	 console.log("Crea ronda " + this.rounds + " ronda " + round);
   return this;
 }*/
/*
 GameSchema.methods.newRound = function(){
   var round = new Round(this, this.currentHand);
   this.currentRound = round;
   this.currentHand = switchPlayer(this.currentHand);
   this.rounds.push(round);
	 console.log("Crea ronda " + this.rounds + " ronda " + round);
   return this;
 }*/
 /*
  * returns the oposite player
  */
 function switchPlayer(player) {
   return "player1" === player ? "player2" : "player1";
 };
 
Game.prototype.pointWin = function(){
	if (this.player1.points() > this.player2.points()){
		return this.player1;
	}
	if (this.player1.points() < this.player2.points()){
		return this.player2;
	}
	if (this.player1.points() == this.player2.points()){
		if (this.currentHand == this.player1)
			return this.player1;
		else 
			return this.player2;
	}
}


 module.exports.game = Game;


