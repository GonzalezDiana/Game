/* Define the player model. */
/*
 * Represents a player in the game
 * @param name [String]: old state to intialize the new state
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Game');
var db= mongoose.connection;
var _ = require('lodash');

var PlayerSchema = mongoose.Schema({
	name: String,
	cards: Array,
	cartasJugadas: Array,
	envidoPoints: Number
});

var Player = mongoose.model('Player', PlayerSchema);

/*function Player(name) {
 this.name = name;
	this.cards = [];
	
	this.cartasJugadas = [];

	this.envidoPoints = 0;    
} */ 

/*
 * Add cards to user and calculate the user points
 */
Player.prototype.setCards = function(cards){
	this.cards = cards;
	this.envidoPoints = this.points();
}

//Points
Player.prototype.points = function(){
	return Math.max(this.cards[0].puntos(this.cards[1]), this.cards[0].puntos(this.cards[2]), this.cards[1].puntos(this.cards[2]));
};

module.exports.player = Player;
