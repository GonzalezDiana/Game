/* Definimos el modelo Game */
var _ = require('lodash');
var playerModel = require('./player');
var deckModel = require('./deck');
var cardModel = require('./card');

// Here we are importing player model.
var Player = playerModel.player;
var Deck = deckModel.deck;

function Game(player1, player2){ 
	var deck = new Deck().mix();
	this.player1 = new Player(player1, deck[0], deck[1], deck[2]);
	this.player2 = new Player(player2, deck[3], deck[4], deck[5]);
};

/*
 * Number of player used in Truco game.
 */
var playerNumbers = [1, 2]; 




module.exports.game = Game;
