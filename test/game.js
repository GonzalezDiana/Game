var expect = require("chai").expect;
var gameModel = require("../models/game.js");

var Game = gameModel.game;

describe('Game', function() {

  describe("properties", function(){
    it('la cantidad de jugadores debe ser 2', function(){
      var d = new Game();
			expect(d).to.have.any.keys('player1', 'player2');
    });
	});
});



	
	



