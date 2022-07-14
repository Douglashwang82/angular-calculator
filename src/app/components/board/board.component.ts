import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() miniDisplay!: string;
  @Input() display!:string;

  constructor() { }

  ngOnInit(): void {}


}
