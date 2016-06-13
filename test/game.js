var expect = require("chai").expect;
var playerModel = require("../models/player");
var gameModel   = require("../models/game");
var cardModel   = require("../models/card");

var Game = gameModel.game;
var Player = playerModel.player;
var Card = cardModel.card;

describe('Game', function(done){
//Guarda en mongoose
/*	it('#save', function(done){
		var g = new Game({name: 'El juego de tu vida'});
		console.log(g.player1);

		g.save(function(err, game){
      console.log("saved game...");
			console.log(err);
      console.log(game.toString());

      if (err) { 
        console.log(err);
				done(err);
      }

      var p = new Player({name: "juan", currentGame: game});

      p.save(function(err, player){
         console.log("saving player");
         console.log(player.name);
         console.log(player.game.toString());
      });
 
      done();
		});
	});
*/

  it('#save', function(done){
		var p = new Player({name: 'Diana'});
		
	  p.save(function(err, player){
      console.log("saved player...");
			console.log(err);
      console.log(player.toString());

      if (err) { 
        console.log(err);
				done(err);
      }

      var g = new Game({name: "juego 2", player1: player});

      g.save(function(err, game){
         console.log("saving game");
         console.log(game.toString());
      });
 
      done();
		});
	});


	it('#recovering', function(done){
    Game.findOne({_id: "575ad763c68fa3ed119e18b5"}).exec(function(err, game){
        console.log("Recovering ref");
        console.log(err);
        console.log(game.toString());
        console.log(game.player1.toString());
        done();
      });
  });

/*
  it('#updating', function(done){
    Game.findOne({name: 'El juego de tu vida'}).exec(function(err, game){
      console.log("encontre el juego");
      console.log(game.toString());

      Player.findOne({name: "juan"}).exec(function(err, player){
        console.log("Encontre a juan");
        console.log(player);
        console.log(player._id);
        game.player1 = player._id;

        game.save(function(err, g){
          console.log("Setting ref");
          console.log(err);
          console.log(game.toString());
          done();
        });
        done();
      });
     done();
    });
  });
*/  

});


/*
var callback = function (err, game){ //El save ejecuta la funcion que le pasamos como parametro (que recibe error y data)
			console.log("adento del callback de save game");
console.log(err);
console.log(game);
			if (console) { err.log(err);
				done(err); }

      var player1 = new Player({name: 'Juan', _creator: game._id});
		  //var player2 = new Player({name: 'Emma Watson'});
		  player1.save(function(err){
        if(err)
          console.log("errorR");
			});
			game.player1 = player1;
			expect(game.player1.name).to.have.property('Juan');			
					console.log(g.player1);

//expect(g.jug1.name).to.have.property('Juan');			//---
			done();
		};

*/

