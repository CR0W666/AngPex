
import { Component } from '@angular/core';

interface Card{
  paired: boolean;
  icon: string;
  flipped: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  //-------------------- VARIABLES -----------------------

  title = 'AngPex';
  difficulty = 5; // # of pairs
  cards: Card[] = []; //array of cards
  flippedCards: Card[] = [];
  foundPairs: Card[] = [];
  won: boolean = false;
  flips: number = 0;


  //-------------------- MAIN -----------------------

  startGame(num: number) {
    this.clean();
    this.setDifficulty(num);
    this.fillArrayWithCards();
    this.cards = this.shuffleArray(this.cards);
    
  }

  //-------------------- SETUP -----------------------

  setDifficulty(num: number) { //sets the game difficulty || # of pairs
    this.difficulty = num;
  }

  clean() { //cleans the card array
    this.cards = [];
    this.flippedCards = [];
    this.foundPairs = [];
    this.won = false;
    this.flips = 0;
  }

  fillArrayWithCards() { //fills the card array with cards

    for (let i = 0; i < this.difficulty; i++) { //creates card pairs

      for(let x = 0; x < 2; x++) this.cards.push(this.createCard(i as unknown as string));
    }
  }

  shuffleArray(array: any[]) { //shuffles given array

    return array.sort(() =>  Math.random() - 0.5);
  }

  createCard(icon: string) { //returns card with specified icon

    let newCard: Card = {paired: false, icon: icon, flipped: false}; 
    return newCard;
  }


  //-------------------- LOGIC -----------------------

  async selected(card: Card) {
    console.log(card);
    this.flips++;
    if(!this.hasBeenFound(card)) {
      
      this.flippedCards.push(card);
      card.flipped = true;
      this.how();
      if(this.sameCardCheck()) {
        await this.hide(false, 0);
        this.flippedCards = [];
        throw new Error("you clicked this card already");
      } else {
        if(this.hasPairSelected()) {
            if(this.compareSymbols()) {
              this.pairFound();
              this.askIfWon();
            } else {
              await this.hide(true, 250);
              this.flippedCards = [];
            }
        }
      }


    } else throw new Error("already found");



  }

  how() {
    console.log("how???");
    if(this.flippedCards.length > 1) {
      if(this.flippedCards[2] != undefined) {
        this.flippedCards[2].flipped = false;
        this.flippedCards.pop();
      }
    }
  }

  askIfWon() {
    if(this.foundPairs.length/2 == this.difficulty) {
      this.won = true;
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  sameCardCheck() {
    return this.flippedCards[0] == this.flippedCards[1];
  }

  hasPairSelected() {
    return this.flippedCards.length == 2;
  }

  async hide(delay: boolean, delayTime: number) {
    console.log("hiding");
    if(delay) { await this.delay(delayTime); }
    console.log(this.flippedCards);
    if(this.flippedCards[0] != undefined) this.flippedCards[0].flipped = false;
    if(this.flippedCards[1] != undefined) this.flippedCards[1].flipped = false;
  }


  compareSymbols() {
    return this.flippedCards[0].icon == this.flippedCards[1].icon;
  }

  hasBeenFound(card: Card) {
    return this.foundPairs.includes(card);
  }

  pairFound() {
    this.foundPairs.push(this.flippedCards[0]);
    this.foundPairs.push(this.flippedCards[1]);
    this.flippedCards[0].paired = true;
    this.flippedCards[1].paired = true;
    this.flippedCards = [];
  }




  



}
