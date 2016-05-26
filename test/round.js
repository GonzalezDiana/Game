var expect = require("chai").expect;
var card_model   = require("../models/card");
var player_model = require("../models/player");
var game_model   = require("../models/game");
var round_model   = require("../models/round");

var Game  = game_model.game;
var Round = round_model.round;
var Card = card_model.card;

describe('Round', function(){
	var game;
	beforeEach(function(){
		game = new Game();
		game.newRound();
	});
	
	describe("#deal", function(){
		it("should populate player1 cards", function(){
			var round = new Round(game);
			round.deal();
			expect(game.player1.cards.length).to.be.equal(3);
		});
 		it("should populate player2 cards", function(){
			var round = new Round(game);
			round.deal();
			expect(game.player2.cards.length).to.be.equal(3);
		});
	});




/*describe('Round#onplaycard', function(){
	var game;
	beforeEach(function(){
		game = new Game();
		game.newRound();
		// Force to have the following cards and envidoPoints
		game.player1.setCards([
			new Card(1, 'copa'),
			new Card(7, 'oro'),
			new Card(2, 'oro')
		]);

		game.player2.setCards([
 			new Card(6, 'copa'),
			new Card(7, 'copa'),
			new Card(2, 'basto')
		]);
	});
	 
	it('plays [envido, no-quiero] should gives 1 points to player 1', function(){
		game.play('player1', 'envido');
		game.play('player2', 'no-quiero');
		expect(game.score).to.deep.equal([1, 0]);
	});
});*/

});
