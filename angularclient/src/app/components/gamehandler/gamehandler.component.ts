import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gamehandler',
  templateUrl: './gamehandler.component.html',
  styleUrls: ['./gamehandler.component.css']
})
export class GamehandlerComponent implements OnInit {
  
  user: String;
  token: String;
  actualScore: Number;
  opponent_cards : card[];
  own_cards :  card[];
  deck: card[];

  constructor(private authService:AuthService,
    private router:Router) { }
  ngOnInit() {
  }

  onTurn(card){
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

type  card= {color : cardColor; value: cardValue;};