/* Define the model game. */
var _ = require('lodash');
var playerModel = require('./player');
var deckModel = require('./deck');
var cardModel = require('./card');
var roundModel = require('./round');

var Player = playerModel.player;
var PlayerSchema = playerModel.playerSchema;
var Round  = roundModel.round;

/** MONGOOSE **/
var mongoose = require('mongoose');
var db= mongoose.createConnection('mongodb://localhost/Game');

db.on('error', console.error.bind(console, 'conection error'));
db.once('open', function(){
	console.log('¡WE ARE CONNECTED!');
});

//var ObjectId = mongoose.Schema.Types.ObjectId; 

/*Definimos el esquema de nuestro juego*/
var GameSchema = mongoose.Schema({
	name: String,
	player1: PlayerSchema, //Uso el jugador completo ahora, ya no uso el id.
	player2: PlayerSchema,
	rounds: {type: Array, default : [] },
	currentHand: PlayerSchema, //String, //jugador
	//currentRound: {type: ObjectId, ref: 'Round'},
	currentRound : Object,
	score: {type: Array, default : [0,0] },

});

/*
  * Create and return a new Round to this game
  */
GameSchema.methods.newRound = function(){
   var round = new Round(this, this.currentHand);
   this.currentRound = round;
   this.currentHand = this.switchPlayer(); //(this.currentHand);
   //this.rounds.push(round);
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

//returns the oposite player
Game.prototype.switchPlayer = function(){
	//console.log(game.currentHand == game.player1);
	//console.log(this.currentHand);
	//console.log(this.player1);
	if (this.currentHand == this.player1)
		return this.currentHand = this.player2;
	else
		return this.currentHand = this.player1;
};
 
//Nos indica quien gana la confrontacion de puntos 
Game.prototype.pointWin = function(){
	//gana el jugador 1
	if (this.player1.points() > this.player2.points()){
		return this.player1;
	}
	//gana el jugador 2
	if (this.player1.points() < this.player2.points()){
		return this.player2;
	}
	//en caso de haber empate, gana el que es mano
	if (this.player1.points() == this.player2.points()){
		if (this.currentHand == this.player1)
			return this.player1;
		else 
			return this.player2;
	}
}

module.exports.game = Game;


