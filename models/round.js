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
var cardModel = require("./card");

var Deck  = deckModel.deck;
var Card = cardModel.card;

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
	]
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
*Manos jugadas y ganadas por los jugadores 
*/
	this.arregloManos = [];

/*
 * Round' score
 */
	this.score = [0, 0];

	this.prevstate=null;

	this.puntostruco=1;

//Reparto Cartas
	this.deal();

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

/*(this.arregloManos (1,1)
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

//Inserto la carta en el arreglo de las cartas sobre la mesa(cartas jugadas)
Round.prototype.guardarCarta = function (player, card){	
	if (this.game.player1 === player){
 		return this.game.player1.cartasJugadas.push(card);
	}else
		return this.game.player2.cartasJugadas.push(card);
}

//Toma un jugador y la carta, devuelve el arreglo de las cartas del jugador sin la carta que jugó
Round.prototype.tirarCarta = function (player,card){	
	if (player.cards[0] == card){
		player.cards[0] = undefined;
		return this.game.player;
	}
	if (player.cards[1] == card){
		//console.log(this.cartasJugadas);
		player.cards[1] = undefined;
		return this.game.player;
	}
	if (player.cards[2] == card){
		player.cards[2] = undefined;
		return this.game.player;
	}	
}

Round.prototype.tiroTodas = function (player){
	aux = false;	
	if((player.cards[0] == undefined) && (player.cards[1] == undefined) && (player.cards[2] == undefined)){
		aux = true;
	}	
	return aux;
}

Round.prototype.confrontaciones = function (){
	//Verifica que haya 2 cartas en juego para 	
	if ((this.game.player1.cartasJugadas[0] !== undefined) && (this.game.player2.cartasJugadas[0] !== undefined)){
		//No se como llamar a confrontacion		
		//Todavia no evalue la posibilidad de empate.. 
		if ((this.game.player1.cartasJugadas[0].confront(this.game.player2.cartasJugadas[0])) == 1)
			//Si gano el jugador 1 en la confrontacion
			return this.arregloManos.push(1);		
		else
			//Si gano el jugador 2 en la confrontacion			
			return this.arregloManos.push(2);
	}
	//Lo mismso para el resto...
	if ((this.game.player1.cartasJugadas[1] !== undefined) && (this.game.player2.cartasJugadas[1] !== undefined)){
		//No se como llamar a confrontacion		
		if ((this.game.player1.cartasJugadas[1].confront(this.game.player2.cartasJugadas[1])) == 1)
			//Si gano el jugador 1 en la confrontacion
			return this.arregloManos.push(1);		
		else
			//Si gano el jugador 2 en la confrontacion			
			return this.arregloManos.push(2);
	}	
	if ((this.game.player1.cartasJugadas[2] !== undefined) && (this.game.player2.cartasJugadas[2] !== undefined)){
		//No se como llamar a confrontacion		
		if ((this.game.player1.cartasJugadas[2].confront(this.game.player2.cartasJugadas[2])) == 1)
			//Si gano el jugador 1 en la confrontacion
			return this.arregloManos.push(1);		
		else
			//Si gano el jugador 2 en la confrontacion			
			return this.arregloManos.push(2);
	}
}

Round.prototype.played = function (action, card){
	if(action = 'playcard') 
		if(this.prevstate == 'init')
			if (this.currentTurn == this.game.player1){
				this.guardarCarta(this.game.player1, card);
				this.tirarCarta(this.game.player1, card);
				return this.game.player1;
			}
			else{
				this.guardarCarta(this.game.player2, card);
				this.tirarCarta(this.game.player2, card);
				return this.game.player2;
			}		
	
		else if((this.prevstate == 'quiero') || (this.prevstate == 'no-quiero') || (this.prevstate == 'playcard')) 
			if (this.currentTurn == this.game.player1){
				if (this.tiroTodas(this.game.player1) == false){
					this.guardarCarta(this.game.player1, card);
					this.tirarCarta(this.game.player1, card);
				}
				else 
					throw new Error("Se jugaron todas las cartas no puede volver a tirar.");
				return this.game.player1;
			}
			else{
				if (this.tiroTodas(this.game.player2) == false){
					this.guardarCarta(this.game.player1, card);
					this.tirarCarta(this.game.player1, card);
				}
				else
					throw new Error("Se jugaron todas las cartas no puede volver a tirar.");
				return this.game.player1;
			}		
}

Round.prototype.hayGanador = function (){	
	aux = 0;	
	if ((this.arregloManos == [1,1]) || (this.arregloManos == [1,2,1]) || (this.arregloManos == [2,1,1]))
		aux = 1;
	if ((this.arregloManos == [2,2]) || (this.arregloManos == [2,1,2]) || (this.arregloManos == [1,2,2]))
		aux = 2; 
	return aux;
}


/*
* Let's Play :)
*/


Round.prototype.play = function(player, action, value) {
	
	this.prevstate=this.fsm.current;
	//console.log(this.prevstate,"aa");
	// move to the next state
	this.fsm[action](player, value);

	//check if is needed play a card
	this.played(action,value);

	// check if is needed sum score
	this.calculateScore(action);
	
	//check the confrontations
	this.confrontaciones();	

	//check the status of hands
	if (this.hayGanador() == 1)
		return(this.game.player1);	
	if (this.hayGanador() == 2)
		return(this.game.player2);

	// Change player's turn
	return this.changeTurn();
}
module.exports.round = Round;
