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

/*
 * Returns the user envido points
 */
/* +Player.prototype.points = function(){
 +  var pairs = [
 +    [this.cards[0], this.cards[1]],
 +    [this.cards[0], this.cards[2]],
 +    [this.cards[1], this.cards[2]],
 +  ];
 +
 +  var pairValues = _.map(pairs, function(pair){
 +    return pair[0].envido(pair[1]);
 +  });
 +
 +  return _.max(pairValues);
 +};
 +
 + */

/*function Player(name, card1, card2, card3){ 
	this.name = name;
	this.card1= card1;
	this.card2= card2;
	this.card3= card3;
	this.points = this.puntos();
	console.log(this);
};
*/
//Points
Player.prototype.points = function(){
	return Math.max(this.cards[0].puntos(this.cards[1]), this.cards[0].puntos(this.cards[2]), this.cards[1].puntos(this.cards[2]));
};

module.exports.player = Player;
