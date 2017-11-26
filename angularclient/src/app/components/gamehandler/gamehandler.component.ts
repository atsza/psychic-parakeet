import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-gamehandler',
  templateUrl: './gamehandler.component.html',
  styleUrls: ['./gamehandler.component.css']
})
export class GamehandlerComponent implements OnInit {
  token: String;
  player1 : Player;
  player2 : Player;

  deck: Card[];
  cardColors : String[];
  cardFigures : String[];
  cardValues : number[];
  started : boolean;
  dominantCard: Card;
  actualPlayedCard: Card;
  actualAnsweredCard: Card;
  dominantColor: String;


  connection;
  messages = [];
  message;

  constructor(private authService:AuthService,
    private router:Router,
  private socketService: SocketService) {
      this.cardColors= ["Hearts","Bells","Acorns","Leaves"];
      this.cardFigures= ["Lower","Upper","King","Ten","Ace"];
      this.cardValues= [2,3,4,10,11]
      this.player1=new Player("");
      this.player2=new Player("");

      this.deck=[];
      this.actualPlayedCard=new Card("","",0);
      this.actualAnsweredCard=new Card("","",0);
      this.dominantCard=new Card("","",0);
      this.started=false;
      this.dominantColor="";
      
     }
  ngOnInit() {
    this.connection = this.socketService.getMessages().subscribe(message => {
     this.messages.push(message);
  })
}

ngOnDestroy() {
  this.connection.unsubscribe();
}

sendMessage(){
  this.message = 'johohoho';
  this.socketService.sendMessage(this.message);  
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
    if(this.isFirstPlayedHigher(player.actualPlayed,answer.actualPlayed)){
      player.actualScore += player.actualPlayed.value + answer.actualPlayed.value;
      player.cardsWon.push(player.actualPlayed);
      player.cardsWon.push(answer.actualPlayed);
    }
    else{
      answer.actualScore += player.actualPlayed.value + answer.actualPlayed.value;
      answer.cardsWon.push(player.actualPlayed);
      answer.cardsWon.push(answer.actualPlayed);
    }
  }

  isFirstPlayedHigher(first : Card, answer : Card){
    if(first.color == this.dominantColor && answer.color != this.dominantColor)
      return true;
    else if(first.color != answer.color)
      return true;
    else if(first.value > answer.value)
      return true;
    else
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
    else
      player.hand.push(this.dominantCard);
  }

  playCard(card : Card){
    this.player1.actualPlayed=this.player1.hand.find(x=> x.color==card.color && x.value==card.value)
    this.player1.hand.splice(this.player1.hand.findIndex(x=> x.color==card.color && x.value==card.value),1);
    this.comboScore(this.player1.actualPlayed);
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
  socketStatus : String;
  actualScore : number;
  hand : Card[];
  actualPlayed: Card;
  cardsWon : Card[];
  risk : boolean;
  snapszer : boolean;
  
  constructor(socketStatus: String){
    this.socketStatus=socketStatus;
    this.actualScore=0;
    this.hand = [];
    this.actualPlayed = new Card("","",0);
    this.cardsWon = [],
    this.risk=false;
    this.snapszer=false;
  }
};