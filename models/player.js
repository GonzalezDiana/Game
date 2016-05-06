/* Definimos modelo player. */

function Player(name, card1, card2, card3){ 
	this.name = name;
	this.card1= card1;
	this.card2=	card2;
	this.card3= card3;
	console.log(this);
};




module.exports.player = Player;
