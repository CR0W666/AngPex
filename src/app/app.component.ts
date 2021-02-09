import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component } from '@angular/core';

interface Card{
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

    let newCard: Card = {icon: icon, flipped: false}; 
    return newCard;
  }


  //-------------------- LOGIC -----------------------

  



}
