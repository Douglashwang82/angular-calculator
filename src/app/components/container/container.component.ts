import { Component, OnInit } from '@angular/core';
import { CalculatorService } from 'src/app/services/calculator.service';
import { LoggerService } from 'src/app/services/logger.service';
import { CalculatorRecord } from 'src/models/calculatorStates.model';

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

    Issues sovled:
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
  model = new CalculatorRecord('', '', '', ''); // previousOperand, currentOperand, operator, result
  errorMessage: string = '';
  isUpdatingCurrentOperand: boolean = false;
  miniDisplay: string = '';
  display: string = '';
  calculatorRecords: CalculatorRecord[] = [];

  constructor(private calculatorService: CalculatorService, private loggerService: LoggerService) { }

  ngDoCheck() {
    this.updateDisplay();
    this.loggerService.logObjectStates(this);
  }

  ngOnInit(): void {
    this.calculatorService.getCalculatorRecords().subscribe((records) => (
      this.calculatorRecords = Array.isArray(records) ? records.reverse() : []));
  }

  clickOperand(content: string) {
    // Check maximum length of number
    if (this.model.currentOperand.length >= 15 && !this.isUpdatingCurrentOperand) return;
    // Handle cases: x + y = z
    if (this.model.result) {
      // Recover from error
      if (this.errorMessage) this.clear();
      // case: x + y = z
      this.model.previousOperand = this.model.result;
      this.isUpdatingCurrentOperand = true;
      this.model.result = '';
    }
    // replace currentOperand or update currentOperand with concat()
    if (this.isUpdatingCurrentOperand) {
      this.model.currentOperand = content;
      //handle case '.' as first input
      if (content === '.') this.model.currentOperand = '0.';
      this.isUpdatingCurrentOperand = false;
    } else {
      // handling multiple '.' case
      if (content === '.' && this.model.currentOperand.includes('.')) return;
      // handle leading zeros
      if (!this.model.currentOperand.includes('.') && this.model.currentOperand.startsWith('0') && content === '0') return;
      if (this.model.currentOperand == '0' && content !== '.') {
        this.model.currentOperand = content;
      } else {
        // basic usage
        this.model.currentOperand = this.model.currentOperand.concat(content);
      }
    }
  }

  clickOperator(content: string) {
    // Recover from error
    if (this.errorMessage) this.clear();
    // handle case: x + y + z + .....
    if (this.model.operator && this.model.currentOperand && this.model.previousOperand && !this.model.result) this.calculate();
    // handle case x++......
    if (!this.model.currentOperand) {
      if (this.model.previousOperand) {
        this.model.operator = content;
      }
      return;
    }
    // handle case: x + y = z
    if (this.model.result) {
      this.model.currentOperand = this.model.result;
      this.model.result = '';
    }
    // case y -> y + 
    this.model.previousOperand = this.model.currentOperand;
    this.model.operator = content;
    this.model.currentOperand = '';
    this.isUpdatingCurrentOperand = true;
  }

  calculate() {
    // basic use case
    this.model.result = this.calculatorService.calculateResult(Number(this.model.previousOperand), Number(this.model.currentOperand), this.model.operator);
    // handle calculate error
    if (!Number(this.model.result) && Number(this.model.result) !== 0) {
      this.errorMessage = this.model.result
    } else {
      // success case
      this.calculatorService.postCalculatorRecords(this.model).subscribe((record) => this.calculatorRecords.unshift(record));
    };
  }

  clickEqualSign() {
    // case: x +
    if (!this.model.currentOperand) this.model.currentOperand = this.model.previousOperand;

    // case: y
    if (!this.model.previousOperand || !this.model.operator) return;

    // handle case: x + y =.....
    if (Number(this.model.result) || this.model.result === '0') this.model.previousOperand = this.model.result;
    this.calculate();
  }

  clear() {
    this.model = new CalculatorRecord('', '', '', '');
    this.errorMessage = '';
  }

  clearEntry() {
    if (this.errorMessage) {
      this.clear();
      return;
    }
    if (this.model.result) {
      // case: x + y = z
      this.model.previousOperand = this.model.currentOperand;
      this.isUpdatingCurrentOperand = true;
      this.model.result = ''
    } else {
      this.model.currentOperand = '';
    }
  }

  negativePositive(stringNumber: string) {
    return stringNumber.startsWith('-') ? stringNumber.slice(1) : '-' + stringNumber;
  }

  clickNegativePositive() {
    let ready: string;
    // case: x + y = z   -> -z
    if (this.model.result) {
      ready = this.negativePositive(this.model.result);
      this.clear()
      this.model.previousOperand = ready;
    } else if (this.model.previousOperand && this.model.operator && this.model.currentOperand) {
      // case: x + y      -> x + (-y)
      ready = this.negativePositive(this.model.currentOperand)
      this.model.currentOperand = ready;
    } else if (this.model.previousOperand && this.model.operator) {
      // case: x +        -> x + (-x)
      ready = this.negativePositive(this.model.previousOperand);
      this.model.currentOperand = ready;
    } else if (this.model.currentOperand) {
      // case: y          -> -y
      ready = this.negativePositive(this.model.currentOperand)
      this.model.currentOperand = ready
    } else if (this.model.previousOperand) {
      ready = this.negativePositive(this.model.previousOperand)
      this.model.previousOperand = ready;
    }
    else {
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

  setStates(calculatorRecord: CalculatorRecord) {
    this.clear();
    this.model.previousOperand = calculatorRecord.previousOperand
    this.model.currentOperand = calculatorRecord.currentOperand;
    this.model.operator = calculatorRecord.operator;
    this.model.result = calculatorRecord.result;
    this.updateDisplay();
  }

  handleNegativeNumberDisplay(number: string) {
    const formatted = number.startsWith('-') ? '(' + number + ")" : number;
    return formatted;
  }
  
  updateDisplay() {
    this.miniDisplay = this.model.result ?
      `${this.handleNegativeNumberDisplay(this.model.previousOperand)} ${this.model.operator} ${this.handleNegativeNumberDisplay(this.model.currentOperand)} =` :
      `${this.handleNegativeNumberDisplay(this.model.previousOperand)} ${this.model.operator}`;

    this.display = `${this.errorMessage ? this.errorMessage :
      this.model.result ? this.formatDisplayStringNumber(this.model.result) :
        this.model.currentOperand ? this.formatDisplayStringNumber(this.model.currentOperand) :
          this.model.previousOperand ? this.formatDisplayStringNumber(this.model.previousOperand) :
            '0'
      }`;
  }
}
