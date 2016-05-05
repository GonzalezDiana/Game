var cardModel = require("../models/game.js");

var Card = gameModule.game;

describe('Game', function() {
	it('la cantidad de jugadores debe ser 2',function(){
   		 var d = new Game();
  		 expect(d.playerNumer.length).to.be.eq(2); //nuestro jugadores seran 2
  	});
});
