/* Test */

var expect = require("chai").expect;
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");
var gameModel = require("..models/game.js");

var Player = playerModel.player;
var Card = cardModel.card;
var Game = gameModel.game;

describe('Player', function(){
	var player1 = new Player('Bradd Pitt');
	var Player2 = new Player('Emma Watson');
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
      var d = new Player('Brad Pitt');
      expect(d.points).to.be.eq(29);
    });
	 });
});


/*describe('Player', function() {
	it('should have a name, card1, card2, card3 properties', function(){
      var d = new Player('Brad Pitt', new Card(1, 'espada'), new Card(3,'basto'), new Card (4,'copa'));
      expect(d).to.have.any.keys('name', 'card1', 'card2', 'card3'); 
  });

	//controls the amount of points
	describe('Points', function() {
	it('should return 30', function(){
      var d = new Player('Brad Pitt', new Card(7, 'basto'), new Card(3,'basto'), new Card (4,'copa'));
      expect(d.points).to.be.eq(30);
    });
	 });
 });
*/

