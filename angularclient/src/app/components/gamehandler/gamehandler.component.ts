import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-gamehandler',
  templateUrl: './gamehandler.component.html',
  styleUrls: ['./gamehandler.component.css']
})
export class GamehandlerComponent implements OnInit {
  
  user: String;
  token: String;
  actualScore: Number;
  opponent_cards : Card[];
  public own_cards :  Card[];
  deck: Card[];
  deck_upsideDown: Card;
  cardsWon : Card[];
  opponent_cardsWon : Card[];

  


  constructor(private authService:AuthService,
    private router:Router) {
      this.opponent_cards=[];
      this.own_cards=[];
      this.deck=[];
      this.cardsWon=[];
      this.opponent_cardsWon=[];
      

      this.opponent_cards.push(new Card(cardColor.Hearts,cardValue.Ace));
      this.opponent_cards.push(new Card(cardColor.Bells,cardValue.Ace));
      this.opponent_cards.push(new Card(cardColor.Acorns,cardValue.Ace));
     }
  ngOnInit() {
  }

  //Logic if the card can be deployed

  onStart(){
   this.createDeck();
    for(var i =0;i<5;i++){
      this.own_cards.push(this.deck.pop());
    }
    for(var i =0;i<5;i++){
      this.opponent_cards.push(this.deck.pop());
    }
    this.deck_upsideDown=(this.deck.pop());


  }


  drawCard(){
   if(this.deck.length!=0){
     this.own_cards.push(this.deck.pop());
   }
   else
   this.own_cards.push(this.deck_upsideDown);
  }

  createDeck(){
    var colors = [cardColor.Acorns, cardColor.Bells, cardColor.Hearts, cardColor.Leaves];
    var values = [cardValue.Ace,cardValue.King,cardValue.Lower,cardValue.Ten,cardValue.Upper];

    colors.forEach(c => {
      values.forEach(v => {
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

 enum cardColor {
  Hearts,
  Bells,
  Acorns,
  Leaves
}


enum cardValue {
  Lower,
  Upper,
  King,
  Ten,
  Ace
}

class  Card {
  color : cardColor;
  value: cardValue;

  constructor(color:cardColor ,value: cardValue){
    this.color=color;
    this.value=value;
  }

  
  };