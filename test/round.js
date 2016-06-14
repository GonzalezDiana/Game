var expect = require("chai").expect;
var card_model   = require("../models/card");
var player_model = require("../models/player");
var game_model   = require("../models/game");
var round_model   = require("../models/round");

var Game  = game_model.game;
var Round = round_model.round;
var Card = card_model.card;
var Player = player_model.player;

/*describe('Round', function(){
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

	describe("#tirarCarta", function(){
		var game = new Game();
		game.player1.setCards([
			new Card(1, 'copa'),
			new Card(7, 'oro'),
			new Card(6, 'oro')
		]);
		it("mostrar carta eliminada", function(){
			var round = new Round(game);
			var aux = game.player1.cards[1];
			round.guardarCarta(round.game.player1,aux);
			round.tirarCarta(round.game.player1 , aux);
			var carta2 = game.player1.cards[0];
			round.guardarCarta(round.game.player1, carta2);
			round.tirarCarta(round.game.player1 , carta2);
			//console.log(round.game.player1);
		});
	});


	describe("#tirar todas las cartas", function(){
		var game = new Game();
		game.player1.setCards([
			new Card(2, 'copa'),
			new Card(7, 'oro'),
			new Card(6, 'oro')
		])
		it("tirar todas las cartas", function(){
			var round = new Round(game);
			var carta1 = game.player1.cards[1];
			round.guardarCarta(round.game.player1, carta1);
			round.tirarCarta(round.game.player1 , carta1);
			var carta2 = game.player1.cards[2];
			round.guardarCarta(round.game.player1, carta2);
			round.tirarCarta(round.game.player1 , carta2);
			var carta3 = game.player1.cards[0];
			round.guardarCarta(round.game.player1, carta3);
			round.tirarCarta(round.game.player1 , carta3); 
			expect(round.tiroTodas(round.game.player1)).to.be.eq(true);
			console.log(round.game.player1);
		});
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
}); */

