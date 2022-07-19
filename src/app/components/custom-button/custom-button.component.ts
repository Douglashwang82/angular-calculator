import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css']
})
export class CustomButtonComponent implements OnInit {
  @Input() content: string = "";
  @Output() btnClick: EventEmitter<string> = new EventEmitter();
  @Input() isNumberStyle: boolean = true;
  test:boolean = true;
  constructor() { }

  ngOnInit(): void { }

  onClick() {
    this.btnClick.emit(this.content);
  }
}
