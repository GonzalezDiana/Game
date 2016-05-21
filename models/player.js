/* Define the player model. */

function Player(name, card1, card2, card3){ 
	this.name = name;
	this.card1= card1;
	this.card2= card2;
	this.card3= card3;
	this.points = this.puntos();
	console.log(this);
};

//Points
Player.prototype.puntos = function(){
	return Math.max(this.card1.puntos(this.card2), this.card1.puntos(this.card3), this.card2.puntos(this.card3));
};

module.exports.player = Player;
