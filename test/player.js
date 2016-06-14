/* Test */

var expect = require("chai").expect;
var playerModel = require("../models/player.js");
var cardModel = require("../models/card.js");
var gameModel = require("../models/game.js");

var Player = playerModel.player;
var Card = cardModel.card;
var Game = gameModel.game;

describe('Player', function(){
	var player1 = new Player({name: 'Juan'});
	var player2 = new Player({name: 'Emma Watson'});
	it('Should have a name', function(){
		expect(player1).to.have.property('name');
		expect(player2).to.have.property('name');
	});

	//Guarda en mongoose
	/*it('#save Juan', function(done){
		var data = {
			name: 'Juan',
			cards: [new Card(1,'espada')],
			envidoPoints:28,
			cartasJugadas: []
		}
		var p = new Player(data);
		var callback = function (err, Player){ //El save ejecuta la funcion que le pasamos como parametro (que recibe error y data)
			if (err)
				done(err);
			expect(player1.name).to.be.eq(data.name);
			done();
		};
		p.save(callback);
	});

	it('Should recover info', function(done){
    Player.findOne({name: 'Juan'}).exec(function(err, player){
      console.log("encontre el jugador Juan");
      console.log(player.name);
			done();
		});
	}); */

});






//-------------------------------------------------------------------------------------------------------------
	//controls the amount of points
/*	describe('Points', function() {		
		var game = new Game();
		game.player1.setCards([
			new Card(1, 'copa'),
			new Card(7, 'oro'),
			new Card(6, 'oro')
		]);
		game.player2.setCards([
			new Card(12, 'copa'),
			new Card(10, 'copa'),
			new Card(3, 'oro')
		]);
		it('should points player1 return 33', function(){
      expect(game.player1.points()).to.be.eq(33);
    });

		it('should points player2 return 20', function(){
			expect(game.player2.points()).to.be.eq(20);
	 	});
	});
		
		var game2 = new Game{};
		game2.player1.setCards([
			new Card(1, 'copa'),
			new Card(7, 'oro'),
			new Card(2, 'basto')
		]);
		game2.player2.setCards([
			new Card(11, 'copa'),
			new Card(11, 'basto'),
			new Card(11, 'oro')
		]);
	
		it('should points game2.player1 return 7', function(){
			expect(game2.player1.points()).to.be.eq(7);
	 	});
		
		it('should points game2.player2 return 0', function(){
			expect(game2.player2.points()).to.be.eq(0);
	 	}); 
	});
}); */


