/* Define the model game. */
var _ = require('lodash');
var playerModel = require('./player');
var deckModel = require('./deck');
var cardModel = require('./card');

var Player = playerModel.player;
var Round  = roundModel.round;
 
function Game(player1, player2){
   /*
    * Player 1
    */
   this.player1 = new Player('Player 1');
 
   /*
    * Player 2
    */
   this.player2 = new Player('Player 2');
 
   /*
    * sequence of previous Rounds
    */
   this.rounds = [];
 
   /*
    * Game's hand
    */
   this.currentHand = 'player1';
 
   /*
    * Game's hand
    */
   this.currentRound = undefined;
 
   /*
    * Game' score
   */
   this.score = [0, 0];
 }
 
 /*
  * Check if it's valid move and play in the current round
  */
 Game.prototype.play = function(player, action, value){
   if(this.currentRound.currentTurn !== player)
     throw new Error("[ERROR] INVALID TURN...");
 
   if(this.currentRound.fsm.cannot(action))
     throw new Error("[ERROR] INVALID MOVE...");
 
   return this.currentRound.play(action, value);
 };
 
 /*
  * Create and return a new Round to this game
  */
 Game.prototype.newRound = function(){
   var round = new Round(this, this.currentHand);
   this.currentRound = round;
   this.currentHand = switchPlayer(this.currentHand);
   this.rounds.push(round);
 
   return this;
 }
 
 /*
  * returns the oposite player
  */
 function switchPlayer(player) {
   return "player1" === player ? "player2" : "player1";
 };
 
 module.exports.game = Game;


