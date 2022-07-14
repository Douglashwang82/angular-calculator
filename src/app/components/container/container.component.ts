import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { calculateResult } from '../../helperfunctions/calculatorHelper';
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
/*
  Notes:
    Cases:
      1 + 2 = 3
      1 + =....
      1 + +
      1 + 2 + 3....

    Issues:
      max_safe_integer = 2^53 - 1
*/
export class ContainerComponent implements OnInit {
  previousOperand: string = '';
  currentOperand: string = '';
  operator: string = '';
  equalSign: string = '';
  result: string = '';
  error: string = '';
  isUpdatingCurrentOperand: boolean = false;
  miniDisplay: string = '';
  display: string = '';

  constructor() { }

  ngOnInit(): void { }

  clickOperand(content: string) {
    if (this.result) {
      this.previousOperand = this.result;
      this.isUpdatingCurrentOperand = true;
      this.result = '';
    }
    if (this.isUpdatingCurrentOperand) {
      if (content === '.') {
        this.currentOperand = '0.';
      } else {
      this.currentOperand = content;
    }
    this.isUpdatingCurrentOperand = false;
    } else {
      if (content === '.' && this.currentOperand.includes('.')) return;
      this.currentOperand = this.currentOperand.concat(content);
    }
    this.updateDisplay();
  }

  clickOperator(content: string) {
    if (this.operator && !this.result) this.calculate();
    if (this.result) {
      this.previousOperand = this.result;
      this.currentOperand = this.result;
      this.result = '';
    }
    this.previousOperand = this.currentOperand;
    this.operator = content;
    this.isUpdatingCurrentOperand = true;
    this.updateDisplay();
  }

  calculate() {
    if (Number(this.result) || this.result === '0') this.previousOperand = this.result;
    this.result = calculateResult(Number(this.previousOperand), Number(this.currentOperand), this.operator);
    console.log('calculated', this.result);
  }

  clickEqualSign() {
    if (!this.previousOperand || !this.currentOperand || !this.operator) return;
    this.calculate();
    this.updateDisplay();
  }

  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operator = '';
    this.result = '';
    this.equalSign = '';
    this.updateDisplay();
  }

  clearEntry() {
    if (this.result) {
      this.previousOperand = this.currentOperand;
      this.isUpdatingCurrentOperand = true;
      this.result = ''
    } else {
      this.currentOperand = '0';
    }
    this.updateDisplay();
  }

  updateDisplay() {
    this.miniDisplay = this.result ?
      `${this.previousOperand} ${this.operator} ${this.currentOperand} =` :
      `${this.previousOperand} ${this.operator}`

    this.display = `${this.result ? 'r' + this.result :
      this.currentOperand ? 'c' + this.currentOperand :
        'p' + this.previousOperand}`
  }
}
