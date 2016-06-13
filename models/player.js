/* Define the player model. */
/*
 * Represents a player in the game
 * @param name [String]: old state to intialize the new state
 */

var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/Game');
var db= mongoose.createConnection('mongodb://localhost/Game');
var _ = require('lodash');

var PlayerSchema = mongoose.Schema({
	name: String,
	cards: Array,
	cartasJugadas: Array,
	envidoPoints: Number,
        currentGame: { type: Number, ref: 'Game' }
});

var Player = mongoose.model('Player', PlayerSchema); 

/*function Player(name) {
 this.name = name;
	this.cards = [];
	
	this.cartasJugadas = [];

	this.envidoPoints = 0;    
} */


Player.prototype.setCards = function(cards){
	this.cards = cards;
	this.envidoPoints = this.points();
}

//Points
Player.prototype.points = function(){
	return Math.max(this.cards[0].puntos(this.cards[1]), this.cards[0].puntos(this.cards[2]), this.cards[1].puntos(this.cards[2]));
};

module.exports.player = Player;
