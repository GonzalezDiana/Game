/* Test */

var expect = require("chai").expect;
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");
var gameModel = require("../models/game.js");

var Player = playerModel.player;
var Card = cardModel.card;
var Game = gameModel.game;

describe('Player', function(){
	var player1 = new Player('Brad Pitt');
	var player2 = new Player('Emma Watson');
	it('Should have a name', function(){
		expect(player1).to.have.property('name');
		expect(player2).to.have.property('name');
	});

	//controls the amount of points
	describe('Points', function() {
		var game = new Game();
		game.player1.setCards([
			new Card(1, 'copa'),
			new Card(7, 'oro'),
			new Card(2, 'oro')
		]);
		it('should return 29', function(){
      expect(game.player1.points()).to.be.eq(29);
    });
	 });
});


