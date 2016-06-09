/* Define the player model. */
/*
 * Represents a player in the game
 * @param name [String]: old state to intialize the new state
 */

var mongoose = require('mongoose');
var _ = require('lodash');

function Player(name) {
  /*
   * the player's name
   */
 this.name = name;

	/*
	* cards of this user
	*/
	this.cards = [];

	/*
	cartas jugadas	
	*/	
	this.cartasJugadas = [];

 /*
	* user envido points
	*/
	this.envidoPoints = 0;    
}

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
