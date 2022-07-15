import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, Input, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { calculateResult } from '../../helperfunctions/calculatorHelper';
import { logStates } from '../../helperfunctions/loggers';
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
/*
  Notes:
    Cases:
      error
      x + y = z
      x + y
      x +
      y
      0

    Issues:
      max_safe_integer = 2^53 - 1
      calculation
          float ponit
          divided by zero

      input logic
          leading zero
          multiple '.'

      states change
          cases study
          
      display
          error message
          cases study
*/
export class ContainerComponent implements OnInit {
  previousOperand: string = '';
  currentOperand: string = '';
  operator: string = '';
  result: string = '';
  errorMessage: string = '';
  isUpdatingCurrentOperand: boolean = false;
  miniDisplay: string = '';
  display: string = '0';

  constructor() { }


  ngDoCheck() {
    this.updateDisplay();
    logStates(this);
  }

  ngOnInit(): void { }

  clickOperand(content: string) {
    // Check maximum length of number
    if (this.currentOperand.length >= 15 && !this.isUpdatingCurrentOperand) return;
    // Handle cases: x + y = z
    if (this.result) {
      // Recover from error
      if (this.errorMessage) this.clear();
      // case: x + y = z
      this.previousOperand = this.result;
      this.isUpdatingCurrentOperand = true;
      this.result = '';
    }
    // replace currentOperand or update currentOperand with concat()
    if (this.isUpdatingCurrentOperand) {
      this.currentOperand = content;
      //handle case '.' as first input
      if (content === '.') this.currentOperand = '0.';
      this.isUpdatingCurrentOperand = false;
    } else {
      // handling multiple '.' case
      if (content === '.' && this.currentOperand.includes('.')) return;
      // handle leading zeros
      if (!this.currentOperand.includes('.') && this.currentOperand.startsWith('0') && content === '0') return;
      if (this.currentOperand == '0' && content !== '.') {
        this.currentOperand = content;
      } else {
        // basic usage
        this.currentOperand = this.currentOperand.concat(content);
      }
    }
  }

  clickOperator(content: string) {
    // Recover from error
    if (this.errorMessage) this.clear();
    // handle case: x + y + z + .....
    if (this.operator && this.currentOperand && this.previousOperand && !this.result) this.calculate();
    // handle case x++......
    if (!this.currentOperand) {
      if (this.previousOperand) {
        this.operator = content;
      }
      return;
    }
    // handle case: x + y = z
    if (this.result) {
      this.currentOperand = this.result;
      this.result = '';
    }
    // case y -> y + 
    this.previousOperand = this.currentOperand;
    this.operator = content;
    this.currentOperand = '';
    this.isUpdatingCurrentOperand = true;
  }

  calculate() {
    // handle case: x + y =.....
    if (Number(this.result) || this.result === '0') this.previousOperand = this.result;
    // basic use case
    this.result = calculateResult(Number(this.previousOperand), Number(this.currentOperand), this.operator);
    // handle calculate error
    if (!Number(this.result) && Number(this.result) !== 0) this.errorMessage = this.result;
  }

  clickEqualSign() {
    // case: x +
    if (!this.currentOperand) this.currentOperand = this.previousOperand;

    // case: y
    if (!this.previousOperand || !this.operator) return;

    this.calculate();
  }

  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operator = '';
    this.result = '';
    this.errorMessage = '';
  }

  clearEntry() {
    if (this.errorMessage) {
      this.clear();
      return;
    }
    if (this.result) {
      // case: x + y = z
      this.previousOperand = this.currentOperand;
      this.isUpdatingCurrentOperand = true;
      this.result = ''
    } else {
      this.currentOperand = '';
    }
  }

  negativePositive(stringNumber: string) {
    return stringNumber.startsWith('-') ? stringNumber.slice(1) : '-' + stringNumber;
  }

  clickNegativePositive() {
    let ready: string;
    // case: x + y = z   -> -z
    if (this.result) {
      ready = this.negativePositive(this.result);
      this.clear()
      this.previousOperand = ready;
    } else if (this.previousOperand && this.operator && this.currentOperand) {
      // case: x + y      -> x + (-y)
      ready = this.negativePositive(this.currentOperand)
      this.currentOperand = ready;
    } else if (this.previousOperand && this.operator) {
      // case: x +        -> x + (-x)
      ready = this.negativePositive(this.previousOperand);
      this.currentOperand = ready;
    } else if (this.currentOperand) {
      // case: y          -> -y
      ready = this.negativePositive(this.currentOperand)
      this.currentOperand = ready
    } else {
      return;
    }
  }

  formatDisplayStringNumber(stringNumber: string) {
    let [intergerPart, comma, decimalPart] = stringNumber.split(/(\.)/);
    intergerPart = Number(intergerPart).toLocaleString('en') || "";
    comma = comma || "";
    decimalPart = decimalPart || "";
    return intergerPart + comma + decimalPart;
  }

  updateDisplay() {
    const handleNegativeInMiniBoard = this.currentOperand.startsWith('-') ? '(' + this.currentOperand + ")" : this.currentOperand;

    this.miniDisplay = this.result ?
      `${this.previousOperand} ${this.operator} ${handleNegativeInMiniBoard} =` :
      `${this.previousOperand} ${this.operator}`;

    this.display = `${this.errorMessage ? this.errorMessage :
      this.result ? this.formatDisplayStringNumber(this.result) :
        this.currentOperand ? this.formatDisplayStringNumber(this.currentOperand) :
          this.previousOperand ? this.formatDisplayStringNumber(this.previousOperand) :
            '0'
      }`;
  }
}
