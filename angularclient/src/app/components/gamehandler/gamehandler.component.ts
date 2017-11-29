import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-gamehandler',
  templateUrl: './gamehandler.component.html',
  styleUrls: ['./gamehandler.component.css']
})
export class GamehandlerComponent implements OnInit {
  socket: SocketIOClient.Socket;
  url = "http://localhost:5000";
  status = "offline";
  server_token: String;
  player1 : Player;
  player2 : Player;
  nextPlayer : Player;

  deck: Card[];
  cardColors : String[];
  cardFigures : String[];
  cardValues : number[];
  started : boolean;
  dominantCard: Card;
  dominantColor: String;
  imagePath : String;
  rulelevel : number;


  connection;
  history = [];

  constructor(private authService:AuthService,
    private router:Router) {
      this.server_token = "";
      this.cardColors= ["Hearts","Bells","Acorns","Leaves"];
      this.cardFigures= ["Lower","Upper","King","Ten","Ace"];
      this.cardValues= [2,3,4,10,11]
      this.player1=new Player();
      this.player2=new Player();
      this.authService.loadToken();
      this.player1.token = authService.authToken;
      this.rulelevel = 1;

      this.deck=[];
      this.dominantCard=new Card("","",0);
      this.started=false;
      this.dominantColor="";
      
     }
  ngOnInit() {
    this.socket = io(this.url);
    this.connection = this.getEvents().subscribe(event => {
     this.history.push(event);
  })
}

ngOnDestroy() {
  this.connection.unsubscribe();
}

  onStart(){

   this.createDeck();
   this.started=true;
    for(var i =0;i<5;i++){
      this.drawCard(this.player1);
      this.drawCard(this.player2);
    }
    this.dominantCard=(this.deck.pop());
    this.dominantColor=this.dominantCard.color;
  }

  Score(player : Player, answer : Player){
    if(this.isFirstPlayedHigher(player.actualPlayed, answer.actualPlayed)){
      player.actualScore += player.actualPlayed.value + answer.actualPlayed.value;
      player.cardsWon.push(player.actualPlayed);
      player.cardsWon.push(answer.actualPlayed);
      player.actualPlayed = new Card("","",0);
      answer.actualPlayed = new Card("","",0);

      return player;
    }
    else{
      answer.actualScore += player.actualPlayed.value + answer.actualPlayed.value;
      answer.cardsWon.push(player.actualPlayed);
      answer.cardsWon.push(answer.actualPlayed);
      player.actualPlayed = new Card("","",0);
      answer.actualPlayed = new Card("","",0);
      return answer;
    }

    
  }

  isFirstPlayedHigher(first : Card, answer : Card){
    if (first.color == answer.color) {
        return first.value > answer.value;
    } 
    if (first.color == this.dominantColor) {
        return true;
    }

    return false;
  }

  remainingDeck(){
    return (this.deck.length);
  }

  createDeck(){
    this.cardColors.forEach(c => {
      var i = 0;
      this.cardFigures.forEach(v => {
        this.deck.push (new Card(c,v,this.cardValues[i]));
        i++;
      });
    });    
    
    this.deck=shuffle(this.deck);

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    
      return array;
    }
  }
     
  drawCard(player : Player){
    if(this.remainingDeck()!=0){
      player.hand.push(this.deck.pop());
    }
    else if(this.dominantCard.figure != ""){
      player.hand.push(this.dominantCard);
      this.dominantCard=new Card("","",0);
      console.log(player);
    }
  }

  playCard(card : Card){
    this.status = 'inGame_hold';
    this.player1.actualPlayed=this.player1.hand.find(x=> x.color==card.color && x.value==card.value)
    this.player1.hand.splice(this.player1.hand.findIndex(x=> x.color==card.color && x.value==card.value),1);
    if(this.player2.actualPlayed.figure == "")
      this.comboScore(this.player1.actualPlayed);

    let nextPlayer = this.player2;
    
    if (this.player2.actualPlayed.figure != "") {
      nextPlayer = this.Score(this.player1, this.player2);
      if(this.isNoMoreDrawRuleActive()){
        this.drawCard(nextPlayer);
        this.drawCard(nextPlayer.token == this.player1.token ? this.player2 : this.player1); 
      }
    }
    if (this.deck.length == 0 && this.player1.hand.length == 0 && this.player2.hand.length == 0) {
        this.socket.emit('game_ended', this.exportAction(nextPlayer.token));
    } else {
        this.socket.emit('game_event', this.exportAction(nextPlayer.token));
    }
    return;
  }

  isCardPlayable(card : Card){
    return (this.rulelevel==4 && card.color==this.player2.actualPlayed.color && card.value>=this.player2.actualPlayed.value) || (this.rulelevel==3 && card.color==this.player2.actualPlayed.color) || (this.rulelevel==2 && card.color==this.dominantColor) || this.rulelevel==1;
  }

  findHighestRule(cards : Card[]){
    if (this.player2.actualPlayed.figure != "" && this.isNoMoreDrawRuleActive()){
      cards.forEach(c=>{
        if(c.color==this.player2.actualPlayed.color && c.value>=this.player2.actualPlayed.value){
          this.rulelevel=4;
          return;
        }
        else if(c.color==this.player2.actualPlayed.color){
          this.rulelevel=3;
          return;
        }
        else if(c.color==this.dominantColor){
          this.rulelevel=2;
          return;
        }
      });
    }
    this.rulelevel=1;
  }


  comboScore(card : Card){
    var multiplicity = 1;
    if (card.color==this.dominantColor){
      multiplicity=2;
    }
    if(card.figure=="Upper"){
      this.player1.hand.forEach(element => {
        if (element.figure=="King" && element.color==card.color)
          this.player1.actualScore += 20*multiplicity;
      });
    }
    if(card.figure=="King"){
      this.player1.hand.forEach(element => {
        if (element.figure=="Upper" && element.color==card.color)
          this.player1.actualScore += 20*multiplicity;
      });
    }
  }

  snapszer(){
    this.player1.snapszer=true;
  }

  isSnapszer(){
    return this.player1.snapszer || this.player2.snapszer;
  }

  snapserCausedGameEnd(){
    if(this.isSnapszer() )
      return (this.player1.snapszer && this.player2.actualScore > 0) || (this.player2.snapszer && this.player1.actualScore > 0)
    return false;
  }

  risk(){
    this.player1.risk=true;
  }

  isNoMoreDrawRuleActive(){
    return this.player1.risk || this.player2.risk || this.dominantCard.figure=="";
  }

  isGameEnded(){
    return this.player1.actualScore >= 66 || this.player2.actualScore >= 66 || (this.player1.hand.length==0 && this.player2.hand.length==0) || this.snapserCausedGameEnd();
  }

  resetBoard(){
    this.player1 = new Player();
    this.player2 = new Player();
  }

  exportAction(next_player){
    this.status = 'inGame_hold';
    return {
      deck : this.deck,
      next_player_token : next_player,
      dominant_card : this.dominantCard,
      dominant_color : this.dominantColor,
      player1 : this.player1.is_server_p1 ? this.player1 : this.player2,
      player2 : this.player1.is_server_p1 ? this.player2 : this.player1,
    }
  }

  loadData(data) {
    this.deck = data.deck;
    this.dominantCard = data.dominant_card;
    this.dominantColor = data.dominant_color;
    this.player1 = this.player1.is_server_p1 ? data.player1 : data.player2;
    this.player2 = this.player1.is_server_p1 ? data.player2 : data.player1;
  }

    enterLobby(){
      this.status = 'inLobby';
      this.socket.emit('lobby_request', this.player1.token);
    }
    
    getEvents() {
      let observable = new Observable(observer => {
        this.socket = io(this.url);
        this.socket.on('lobby_request', (token) => {
          if (this.status == 'inLobby' && token != this.player1.token) {
              this.socket.emit('lobby_response', { from: this.player1.token, to: token })
          }
          observer.next({ time: Date(), event: 'lobby_request', payload: token });   
        });
        this.socket.on('lobby_response', (tokens) => {
          if (this.status == 'inLobby' && tokens.to == this.player1.token && tokens.from != this.player1.token ) {
              this.status = 'inGame_hold';
              this.socket.emit('game_accept', { from: this.player1.token, to: tokens.from })
          }
          observer.next({ time: Date(), event: 'lobby_response', payload: tokens });   
        });
        this.socket.on('game_accept', (tokens) => {
          if ((this.status == 'inGame_hold' || this.status == 'inLobby') && (tokens.Player1 == this.player1.token || tokens.Player2 == this.player1.token )) {
              this.status = 'inGame_hold';
              if(this.player1.token==tokens.Player1){
                 this.player1.is_server_p1 = true;
                 this.player2.token = tokens.Player2;
                 this.onStart();
                 this.socket.emit('game_event', this.exportAction(tokens.Player2))
              }
          }
          observer.next({ time: Date(), event: 'game_accept', payload: tokens });   
        });
        this.socket.on('game_event', (data) => {
          data = data.data;
          if (this.status == 'inGame_hold' && (data.player1.token == this.player1.token || data.player2.token == this.player1.token)) {
            this.loadData(data);  
            if (this.player1.token == data.next_player_token) {
                  this.status = 'inGame_active';
                  if (this.isGameEnded() ) {
                    this.socket.emit('game_ended', this.exportAction(this.player1.actualScore > this.player2.actualScore ? this.player1.token : this.player2.token));
                    this.status = this.player1.actualScore > this.player2.actualScore ? 'inGame_won' : 'inGame_lost'
                  }
              }
          } else {
          }
          observer.next({ time: Date(), event: 'game_event', payload: data });   
        });
        this.socket.on('game_ended', (data) => {
            data = data.data;
            if (this.status == 'inGame_hold' && (data.player1.token == this.player1.token || data.player2.token == this.player1.token)) {
              this.loadData(data); 
              if (this.player1.token == data.next_player_token) {
                    this.status = 'inGame_won'
                } else {
                    console.log('from event!');
                    this.status = 'inGame_lost'
                }
                this.resetBoard();
            } 
            observer.next({ time: Date(), event: 'game_ended', payload: data });   
          });
        return () => {
          this.socket.disconnect();
        };  
      })     
      return observable;
    }
}




class  Card {
  color : String;
  figure : String;
  value : number;

  constructor(color: String ,figure: String, value: number){
    this.color=color;
    this.figure=figure;
    this.value=value;
  }
};

class Player{
  token : String;
  is_server_p1 : Boolean;
  actualScore : number;
  hand : Card[];
  actualPlayed: Card;
  cardsWon : Card[];
  risk : boolean;
  snapszer : boolean;
  
  constructor(){
    this.token = "";
    this. is_server_p1 = false;
    this.actualScore=0;
    this.hand = [];
    this.actualPlayed = new Card("","",0);
    this.cardsWon = [],
    this.risk=false;
    this.snapszer=false;
  }
};