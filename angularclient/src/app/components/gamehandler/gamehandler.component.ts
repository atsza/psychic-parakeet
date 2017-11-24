import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

import { MessagecompComponent } from '../messagecomp/messagecomp.component';

@Component({
  selector: 'app-gamehandler',
  templateUrl: './gamehandler.component.html',
  styleUrls: ['./gamehandler.component.css']
})
export class GamehandlerComponent implements OnInit {
  
  user: String;

  token: String;
  actualScore: number;
  opponent_cards : Card[];
  public own_cards :  Card[];
  deck: Card[];
  deck_upsideDown: Card;
  cardsWon : Card[];
  opponent_cardsWon : Card[];
  cardColor : String[];
  cardValue : String[];
  started : boolean;
  actualPlayed: Card;
  


  connection;
  messages = [];
  message;

  constructor(private authService:AuthService,
    private router:Router,
  private socketService: MessagecompComponent) {
      this.cardColor= ["Hearts","Bells","Acorns","Leaves"];
      this.cardValue= ["Lower","Upper","King","Ten","Ace"];
      this.opponent_cards=[];
      this.own_cards=[];
      this.deck=[];
      this.cardsWon=[];
      this.opponent_cardsWon=[];
      this.actualScore=0;

      this.actualPlayed=new Card("","");
      this.deck_upsideDown=new Card("","");
      this.started=false;
      

      // this.opponent_cards.push(new Card(cardColor.Hearts,cardValue.Ace));
      // this.opponent_cards.push(new Card(cardColor.Bells,cardValue.Ace));
      // this.opponent_cards.push(new Card(cardColor.Acorns,cardValue.Ace));
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
  this.message = '';
  this.socketService.sendMessage(this.message);  
}


playCard(card : Card){
  
  var found=this.own_cards.findIndex(x=> x.color==card.color && x.value==card.value);
  this.actualPlayed=this.own_cards.find(x=> x.color==card.color && x.value==card.value);
  this.comboScore(this.actualPlayed);
  
  this.own_cards.splice(found,1);
  
  
}

  comboScore(card : Card){
    var double : number;
    double = 1;
    if (card.color==this.deck_upsideDown.color){
      double=2;
    }
    if(card.value=="Upper"){
    this.own_cards.forEach(element => {
      if (element.value=="King" && element.color==card.color)
      this.actualScore=this.actualScore+ 20*double;
    });
  }
    if(card.value=="King"){
      this.own_cards.forEach(element => {
        if (element.value=="Upper" && element.color==card.color)
        this.actualScore=this.actualScore+ 20*double;
      });
    
  }
  }

  //Logic if the card can be deployed

  onStart(){

   this.createDeck();
   this.started=true;
    for(var i =0;i<5;i++){
      this.own_cards.push(this.deck.pop());
    }
    for(var i =0;i<5;i++){
      this.opponent_cards.push(this.deck.pop());
    }
    this.deck_upsideDown=(this.deck.pop());
    
  }


  remainingDeck(){
    return (this.deck.length+1);
  }

  drawCard(){
   if(this.deck.length!=0){
     this.own_cards.push(this.deck.pop());
   }
   else
   this.own_cards.push(this.deck_upsideDown);
  }

  createDeck(){
    this.cardColor.forEach(c => {
      this.cardValue.forEach(v => {
        this.deck.push (new Card(c,v));
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
    
  
}

class  Card {
  color : String;
  value : String;

  constructor(color: String ,value: String){
    this.color=color;
    this.value=value;

   
  }


  };