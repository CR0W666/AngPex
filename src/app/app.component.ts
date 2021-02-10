
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

  startGame(num: string) {
    this.clean();
    this.setDifficulty(num as unknown as number);
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

  async selected(card: Card) { //called onclick

    this.flips++;                     //increments var that stores tries
    if(!this.hasBeenFound(card)) {    //if card hasnt already been found
      this.flippedCards.push(card);   //pushes selected card into array that stores uncovered//selected cards
      card.flipped = true;            //sets this card as flipped
      this.how();                     //some random bullshittery to handle flipping more than 2 cards
      if(this.sameCardCheck()) {      //checks if new selected card is the same as the first one in the pair
        await this.hide(false, 0);                        //if yes -> hide it
        this.flippedCards = [];                           //-> empty the array
        throw new Error("you clicked this card already"); //throw error
      } else {
        if(this.hasPairSelected()) {        //if user selected a valid pair
            if(this.compareSymbols()) {     //compares the symbols of cards
              this.pairFound();                   //if the pair has the same symbol
              this.askIfWon();                    //asks if the user found all pairs
            } else {
              await this.hide(true, 250);         //if the pair symbols are different hide the cards
              this.flippedCards = [];             //and then empty the array
            }
        }
      }
    } else throw new Error("already found");    //if the user clicks ona card that has been paired, throws error
  }

  how() {     //random bullshittery which somehow works??
    if(this.flippedCards.length > 1) {    //if the user selected more then 2 cards
      if(this.flippedCards[2] != undefined) {        //and that the third card exists
        this.flippedCards[2].flipped = false;      //unflip third selected card
        this.flippedCards.pop();                  //and remove it from the array of slected cards
    }    //i should probably loop over cards with index higher then 1
    }
  }

  askIfWon() {  //asks if the user has won
    if(this.foundPairs.length/2 == this.difficulty) {
      this.won = true;
    }
  }

  delay(ms: number) {   //waits a specified amount of time
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  sameCardCheck() {   //checks if the first selected card is the same as the second one
    return this.flippedCards[0] == this.flippedCards[1];
  }

  hasPairSelected() {     //checks if a pair has been selected
    return this.flippedCards.length == 2;
  }

  async hide(delay: boolean, delayTime: number) {  //hides the selected cards  (after waiting a little bit)
    if(delay) { await this.delay(delayTime); }

    for(let i = 0; i < 2; i++) {
      if(this.flippedCards[i] != undefined) this.flippedCards[i].flipped = false;
    }

    // if(this.flippedCards[0] != undefined) this.flippedCards[0].flipped = false;
    // if(this.flippedCards[1] != undefined) this.flippedCards[1].flipped = false;
  }


  compareSymbols() {  //compares the symbols of selected cards
    return this.flippedCards[0].icon == this.flippedCards[1].icon;
  }

  hasBeenFound(card: Card) {  //checks if the selected card has been already paired
    return this.foundPairs.includes(card);
  }

  pairFound() {     //called when a pair is found
    for(let i = 0; i < 2; i++) {    //pushes both cards into array of paired cards and flags them as paired
      this.foundPairs.push(this.flippedCards[i]);
      this.flippedCards[i].paired = true;
    }
    this.flippedCards = []; //empties the array of selected cards
  }

}
