/* Test */

var expect = require("chai").expect;
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");

var Player = playerModel.player;
var Card = cardModel.card;

describe('Player', function() {
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


