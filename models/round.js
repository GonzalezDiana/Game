var _ = require('lodash');
var mongoose = require("mongoose");
var deckModel = require("./deck.js");
var gameModel = require("./game.js");
var cardModel = require("./card.js");
var playerModel = require("./player.js");
var Deck = deckModel.deck;
var Game = gameModel.game;
var Card = cardModel.card;
var Player = playerModel.player;

//StateMachine
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");


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
	//- ESTO HABRÍA QUE MEJORARLO PORQUE ENTRA EN BUCLE :( ---
	this.game = {_id:game._id,player1:game.player1,player2:game.player2,currentHand:game.currentHand,__proto__:game.__proto__};
	this.fsm = newTrucoFSM();
	this.status = 'running';
	this.arregloManos = []; //Manos jugadas y ganadas por los jugadores 
	this.score = [0, 0];
	this.prevstate=null;
	this.puntostruco=1;
	this.deal(); //Reparto Cartas
	this.currentTurn = this.game.switchPlayer(turn) ;
}

/*
* Generate a new deck mixed and gives to players the correspondent cards
*/
Round.prototype.deal = function(){
	var deck = new Deck().mix();
	this.game.player1.setCards(_.pullAt(deck, 0, 2, 4));
	this.game.player2.setCards(_.pullAt(deck, 1, 3, 5));
};

/* Cambia el turno de los jugadores. DEBERÍAMOS VER CASOS MÁS CONCRETOS
+ if action is 'quiero' or 'no-quiero' and it's playing 'envido' the next
* player to play is who start to chant
*
* + if action is 'quiero' or 'no-quiero' and it's playing 'envido' the next
* player to play is who start to chant */
Round.prototype.changeTurn = function(){
	//return this.currentTurn = this.switchPlayer(this.currentTurn);
	if (this.currentTurn == this.game.player1)
		return this.currentTurn = this.game.player2;
	else
		return this.currentTurn = this.game.player1;
}

//Cambia el jugador corriente. 
Round.prototype.switchPlayer = function (player){
  if (player.name === this.player1.name){
  	player = this.player2;
  }
  else{
  	player = this.player1;
  }
  return player;
};

//Verifica si debe tratar el puntaje
Round.prototype.calculateScore = function(action){
	//Si el estado previo es 'envido'
	if(this.prevstate == 'envido'){
		//Si el estado actual 'quiero'
		if (action == 'quiero') {		
			//Chequea quien gana los puntos	
			if( this.game.pointWin() == this.game.player1 ){ //gana el jugador 1
				this.score = [2, 0]; //le asignamos dos puntos en la ronda al jugador 1 
			}
			else{ //gana el jugador 2
				this.score = [0, 2]; // le asignamos dos puntos en la ronda al jugador 2
			}
		}
		//Si el estado actual 'noquiero'
		else { 
			//Si jugador corriente es el jugador 2
			if (this.currentTurn == this.game.player2){ 
				this.score = [1, 0]; //le asignamos un punto en la ronda al jugador 1
			}
			//Si jugador corriente es el jugador 1
			else{	
				this.score = [0, 1]; //le asignamos un punto en la ronda al jugador 2
			}
		}
	} //fin del caso envido
	else{
		//Si el estado previo es 'truco'
		if(this.prevstate == 'truco'){
			//Si el estado actual 'quiero'
			if (action == 'quiero'){
				this.puntostruco+=1; //
			}
			//Si el estado actual 'noquiero'
			else{ 
				//Si el jugador corriente es el jugador 2	
				if (this.currentTurn == this.game.player2){
					this.score = [1, 0]; //un punto para el jugador uno
				}
				//Si el jugador corriente es el jugador 1
				else{ 	
					this.score = [0, 1]; //un punto para el jugador 2
				}
			}
		}	
	} //fin del caso truco
	//Actualizamos el score del juego.
	this.game.score[0] += this.score[0];
	this.game.score[1] += this.score[1];
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
		player.cards[1] = undefined;
		return this.game.player;
	}
	if (player.cards[2] == card){
		player.cards[2] = undefined;
		return this.game.player;
	}	
}

//Nos indica si un jugador tiro todas las cartas.
Round.prototype.tiroTodas = function (player){
	aux = false;	
	if((player.cards[0] == undefined) && (player.cards[1] == undefined) && (player.cards[2] == undefined)){
		aux = true;
	}	
	return aux;
}

//Verifica que puede realizar una confrontacion y carga un arreglo con su respectivo ganador o empate
Round.prototype.confrontaciones = function (){	
	//Verifica ambos jugadores jugaron una carta 
	if (((this.game.player1.cartasJugadas[0] !== undefined) && (this.game.player2.cartasJugadas[0] !== undefined)) && (this.arregloManos[0] == undefined))
		if ((this.game.player1.cartasJugadas[0].confront(this.game.player2.cartasJugadas[0])) == 1)
			return this.arregloManos.push(1);		
		else 
			if ((this.game.player1.cartasJugadas[0].confront(this.game.player2.cartasJugadas[0])) == -1) 		
				return this.arregloManos.push(2);
			else	
				return this.arregloManos.push(0);

	//Verifica ambos jugadores jugaron dos cartas 
	if (((this.game.player1.cartasJugadas[1] !== undefined) && (this.game.player2.cartasJugadas[1] !== undefined)) && (this.arregloManos[1] == undefined)) 	
		if ((this.game.player1.cartasJugadas[1].confront(this.game.player2.cartasJugadas[1])) == 1)
			return this.arregloManos.push(1);		
		else
			if ((this.game.player1.cartasJugadas[1].confront(this.game.player2.cartasJugadas[1])) == -1) 		
				return this.arregloManos.push(2);
			else
				return this.arregloManos.push(0);
	
	//Verifica ambos jugadores jugaron 3 cartas
	if (((this.game.player1.cartasJugadas[2] !== undefined) && (this.game.player2.cartasJugadas[2] !== undefined)) && (this.arregloManos[2] == undefined))	
		if ((this.game.player1.cartasJugadas[2].confront(this.game.player2.cartasJugadas[2])) == 1)
			return this.arregloManos.push(1);		
		else	
			if ((this.game.player1.cartasJugadas[2].confront(this.game.player2.cartasJugadas[2])) == -1)	
				return this.arregloManos.push(2);
			else
				return this.arregloManos.push(0);
}

//Verifica juega una carta y realiza un tratamiento en la ronda
Round.prototype.played = function (action, card){
	//Si el estado actual es 'playcard'
	if(action == 'playcard'){
		//Si el estado previo es 'init'
		if(this.prevstate == 'init')
			/*Si el jugador corriente es el jugador 1
			* guarda card en el arreglo de las cartas jugadas del jugador corriente
			* tira card de las cartas del jugador corriente
			*/
			if (this.currentTurn == this.game.player1){
				this.guardarCarta(this.game.player1, card); 
				this.tirarCarta(this.game.player1, card); 
				return this.game.player1;
			//Si el jugador corriente es el jugador 2, realiza el mismo tratamiento
			}else{
				this.guardarCarta(this.game.player2, card);
				this.tirarCarta(this.game.player2, card);
				return this.game.player2;
		//Si el estado previo es 'quiero', 'noquiero', 'playcard', 'primer carta'
		}else if((this.prevstate == 'quiero') || (this.prevstate == 'no-quiero') || (this.prevstate == 'playcard') || (this.prevstate == 'primer carta')) 			
			//Si el jugador corriente es el jugador 1				
			if (this.currentTurn == this.game.player1){
				//Si el jugador corriente no tiro todas las cartas
				if (this.tiroTodas(this.game.player1) == false){
					/*guarda card en el arreglo de las cartas jugadas del jugador corriente
					* tira card de las cartas del jugador corriente
					*/
					this.guardarCarta(this.game.player1, card);
					this.tirarCarta(this.game.player1, card);
				//Devuelve un error ya que no hay mas cartas para jugar
				}else
					throw new Error("Se jugaron todas las cartas no puede volver a tirar.");
				return this.game.player1;
			//Si el jugador corriente es el jugador 2, realiza el mismo tratamiento
			}else{	
				if (this.tiroTodas(this.game.player2) == false){
					this.guardarCarta(this.game.player2, card);
					this.tirarCarta(this.game.player2, card);
				}else
					throw new Error("Se jugaron todas las cartas no puede volver a tirar.");
				return this.game.player2;
			}		
	}
}

//Compara caracter por caracter 2 arreglos segun su tamaño
function compAr(arreglo, arreglo0){
	aux = false;
	if (arreglo.length == 2){
		if ((arreglo[0] == arreglo0[0]) && (arreglo[1] == arreglo0[1])){
			aux = true;
		}	
	}
	if (arreglo.length == 3){
		if ((arreglo[0] == arreglo0[0]) && (arreglo[1] == arreglo0[1]) && (arreglo[2] == arreglo0[2])){
			aux = true;
		}	
	}
	return aux;
}

//Devuelve un valor booleano: True=Hay ganador, False=No hay ganador
Round.prototype.hayGanador = function (){
	var aux = false;

	if ((compAr(this.arregloManos,[0,0,0])) || (compAr(this.arregloManos,[1,2,0])) || (compAr(this.arregloManos,[1,2,0]))){
 		aux = true; 	
	}

	if ((compAr(this.arregloManos,[0,1])) || (compAr(this.arregloManos,[1,0])) || (compAr(this.arregloManos,[0,0,1]))){
		aux = true;
		this.game.score[0] += this.puntostruco;	
	}

	if ((compAr(this.arregloManos,[0,2])) || (compAr(this.arregloManos,[2,1,0])) || (compAr(this.arregloManos,[2,0])) || (compAr(this.arregloManos,[0,0,2]))){
		aux = true;
		this.game.score[1] += this.puntostruco;
	}

	if ((compAr(this.arregloManos,[1,1])) || (compAr(this.arregloManos,[1,2,1])) || (compAr(this.arregloManos,[2,1,1]))){
		aux = true;
		this.game.score[0] += this.puntostruco; 
	}

	if ((compAr(this.arregloManos,[2,2])) || (compAr(this.arregloManos,[2,1,2])) || (compAr(this.arregloManos,[1,2,2]))){
		aux = true;
		this.game.score[1] += this.puntostruco;
	}
	
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
	//this.played(action,value);

	// check if is needed sum score
	this.calculateScore(action);

	//check the confrontations
	this.confrontaciones();	

	//check the status of hands
	/*if (this.hayGanador() == 1)
		return(this.game.player1);	
	if (this.hayGanador() == 2)
		return(this.game.player2); */

	// Change player's turn
	return this.changeTurn();
};

module.exports.round = Round;
