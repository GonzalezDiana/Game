/*
*
* Represents a game's round
*
* @param gmae [Object]: game where the round belongs
*
*/

var _ = require('lodash');
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");
var deckModel = require("./deck");
var Deck  = deckModel.deck;

function newTrucoFSM(){
	var fsm = StateMachine.create({
	initial: 'init',
	events: [
		{ name: 'playcard', from: 'init',                           to: 'primer carta' },
		{ name: 'envido',    from: ['init', 'primer carta'],         to: 'envido' },
		{ name: 'truco',     from: ['init', 'played card','primer carta'],          to: 'truco'  },
		{ name: 'playcard', from: ['quiero', 'no-quiero','primer carta', 'played card'],  to: 'played card' },
		{ name: 'quiero',    from: ['envido', 'truco'],              to: 'quiero'  },
		{ name: 'no-quiero', from: ['envido', 'truco'],              to: 'no-quiero' },
	]/*,

	callbacks: {
          onplaycard: function(event, from, to, player, card) {
					this.cartasjugadas.push((player,card)):
          }
  }*/
	});
	return fsm;
}

function Round(game, turn){
/*
* Game
*/
	this.game = game;
/*
* next turn
*/
	this.currentTurn = turn;

/*
* here is a FSM to perform user's actions
*/
	this.fsm = newTrucoFSM();

/*
*
*/
	this.status = 'running';

/*
 * Round' score
 */
	this.score = [0, 0];

	this.prevstate=null;

	this.puntostruco=1;

	this.cartasjugadas=[];
}

/*
* Generate a new deck mixed and gives to players the correspondent cards
*/
Round.prototype.deal = function(){
	var deck = new Deck().mix();
	this.game.player1.setCards(_.pullAt(deck, 0, 2, 4));
	this.game.player2.setCards(_.pullAt(deck, 1, 3, 5));
};

/*
* Calculates who is the next player to play.
*
* + if action is 'quiero' or 'no-quiero' and it's playing 'envido' the next
* player to play is who start to chant
*
* + if action is 'quiero' or 'no-quiero' and it's playing 'envido' the next
* player to play is who start to chant
*
* ToDo
*/
Round.prototype.changeTurn = function(){
	return this.currentTurn = this.switchPlayer(this.currentTurn);
}

/*
* returns the oposite player
*/
Round.prototype.switchPlayer = function(player) {
	return "player1" === player ? "player2" : "player1";
};

Round.prototype.calculateScore = function(action){
	//console.log(this.fsm.current);
	if((action == 'quiero' || action == 'no-quiero')&&(this.prevstate == 'envido')){
		if (action == 'quiero') {			
			if( this.game.pointWin() == this.game.player1 ){
				
				this.score = [2, 0];
				this.game.score[0] += this.score[0];
				this.game.score[1] += this.score[1];
			}
			else{
				this.score = [0, 2];
				this.game.score[0] += this.score[0];
				this.game.score[1] += this.score[1];
			}
		}
		//si player 1 dice no quiero, etonces los puntos son para el player 2(Falta saber quien canto envido para sumarle el punto)
		else {
			if (this.currentTurn == this.game.player2){
				this.score = [0, 1];
				this.game.score[0] += this.score[0];
				this.game.score[1] += this.score[1];
			}
			else
				
					this.score = [1, 0];
					this.game.score[0] += this.score[0];
					this.game.score[1] += this.score[1];
			}
	}
	else{
		if((action == 'quiero' || action == 'no-quiero')&&(this.prevstate == 'truco')){
			if (action == 'quiero'){
				this.puntostruco+=1;
			}
			else{
				if (this.currentTurn == this.game.player2.name){
					this.score = [1, 0];
					this.game.score[0] += this.score[0];
					this.game.score[1] += this.score[1];
				}
				else{
					this.score = [0, 1];
					this.game.score[0] += this.score[0];
					this.game.score[1] += this.score[1];
				}
			}
		}	
	}
  return this.score;
}

/*
* Let's Play :)
*/
Round.prototype.play = function(player, action, value) {
	
	this.prevstate=this.fsm.current;
	//console.log(this.prevstate,"aa");
	// move to the next state
	this.fsm[action](player, value);
	// check if is needed sum score
	this.calculateScore(action);
	// Change player's turn
	return this.changeTurn();
};
module.exports.round = Round;
