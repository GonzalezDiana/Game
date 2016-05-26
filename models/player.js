/* Define the player model. */
/*
 * Represents a player in the game
 * @param name [String]: old state to intialize the new state
 */
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
	* user envido points
	*/
	this.envidoPoints = 0;    //tengo que asignarle el resultado de la funcion points?
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
