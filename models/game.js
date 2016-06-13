/* Define the model game. */
var _ = require('lodash');
var playerModel = require('./player');
var deckModel = require('./deck');
var cardModel = require('./card');
var roundModel = require('./round');

/** MONGOOSE **/
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Game');
// var db= mongoose.connection;
var db= mongoose.createConnection('mongodb://localhost/Game');

db.on('error', console.error.bind(console, 'conection error'));
db.once('open', function(){
	console.log('We are connected!!!');
});

//db.game.remove();

//var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;

var Player = playerModel.player;
var Round  = roundModel.round;

var ObjectId = mongoose.Schema.Types.ObjectId; //Para jugadores

var GameSchema = mongoose.Schema({
        name: String,
	player1: {type: Number, ref: 'Player'},
	player2: {type: ObjectId, ref: 'Player'},
	rounds: Array,
	currentHand: {type: ObjectId, ref: 'Player'}, //jugador
	currentRound: {type: ObjectId, ref: 'Round'},
	score: Array
});

var Game = mongoose.model('Game', GameSchema);

 
/*function Game(player1, player2){
  
   this.player1 = new Player('player1');
   
   this.player2 = new Player('player2');
 
   this.rounds = [];
 
   this.currentHand = 'player1';
 
   this.currentRound = undefined;
 
  
   this.score = [0, 0];
 } */
 
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
 Game.prototype.newRound = function(){
   var round = new Round(this, this.currentHand);
   this.currentRound = round;
   this.currentHand = switchPlayer(this.currentHand);
   this.rounds.push(round);
   return this;
 }
 
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


