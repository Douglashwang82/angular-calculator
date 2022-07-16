import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalculatorService } from 'src/app/services/calculator.service';

type CalculatorRecord = {
  previousOperand: string,
  currentOperand: string,
  operator: string,
  result: string,
  id?: string,
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  @Input() calculatorRecords: CalculatorRecord[] = [];
  @Output() btnClick = new EventEmitter();
  isVisible: boolean = false;

  constructor(private calculateService: CalculatorService) { }

  ngOnInit(): void { }


  onClick(record: CalculatorRecord) {
    this.btnClick.emit(record);
    this.toggleHistory();
  }
  toggleHistory() {
    this.isVisible = !this.isVisible;
  }
}
