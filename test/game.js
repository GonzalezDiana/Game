var expect = require("chai").expect;
var gameModel = require("../models/game.js");

var Game = gameModel.game;

describe('Game', function() {

  describe("properties", function(){
    it('the number of players must be two', function(){
      var d = new Game();
			expect(d).to.have.any.keys('player1', 'player2');
    });
	});
});

