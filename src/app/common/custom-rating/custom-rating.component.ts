import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-rating.component.html',
  styleUrl: './custom-rating.component.scss',
})
export class CustomRatingComponent implements OnInit {
  @Input() ratingValue!: number;
  @Output() ratingChange = new EventEmitter<number>();

  ratings = Array(5).fill(0);
  ratingArray: any = [];
  isBetweenRating: boolean = false;

  ngOnInit(): void {
    // this.ratingArray = Array(Math.floor(this.ratingValue)).fill(0);
    this.ratingArray = [];
    for (let index = 0; index < Math.floor(this.ratingValue); index++) {
      this.ratingArray.push(true);
    };
    let tempRatingArrayLength = this.ratingArray.length;
    if(tempRatingArrayLength > 5){
      this.ratingArray[tempRatingArrayLength + 1] = false
      tempRatingArrayLength++;
    }
    if (
      Math.floor(this.ratingValue) < this.ratingValue &&
      Math.ceil(this.ratingValue) > this.ratingValue
    ) {
      this.isBetweenRating = true;
    } else {
      this.isBetweenRating = false;
    }
  }
}
