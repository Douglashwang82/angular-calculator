import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import{ environment } from '../../environments/environment';
import {CalculatorRecord} from '../../models/calculatorStates.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})

export class CalculatorService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  getCalculatorRecords(): Observable<CalculatorRecord[]> {
    if (!this.apiUrl) return EMPTY;
    const result = this.http.get<CalculatorRecord[]>(this.apiUrl);
    return result;
  }


  postCalculatorRecords(calulatorRecord: CalculatorRecord): Observable<CalculatorRecord> {
    if (!this.apiUrl) return EMPTY;
    const result = this.http.post<CalculatorRecord>(this.apiUrl, calulatorRecord);
    return result
  }


  getDecimalLengthTwoNumbers(num1: number, num2: number): [number, number] {
    const numOneDecimalPart: string = num1.toString().split('.')[1];
    const numTwoDecimalPart: string = num2.toString().split('.')[1];
    const numOneDecimalLength: number = numOneDecimalPart ? numOneDecimalPart.length : 0;
    const numTwoDecimalLength: number = numTwoDecimalPart ? numTwoDecimalPart.length : 0;
    return [numOneDecimalLength, numTwoDecimalLength]
  }

  accurateAdd(num1: number, num2: number): number {
    const [numOneDecimalLength, numTwoDecimalLength]: [number, number] = this.getDecimalLengthTwoNumbers(num1, num2);
    const adjuster: number = Math.pow(10, Math.max(numOneDecimalLength, numTwoDecimalLength));
    return (num1 * adjuster + num2 * adjuster) / adjuster;
  }

  accurateSubtr(num1: number, num2: number): number {
    const [numOneDecimalLength, numTwoDecimalLength]: [number, number] = this.getDecimalLengthTwoNumbers(num1, num2);
    const adjuster: number = Math.pow(10, Math.max(numOneDecimalLength, numTwoDecimalLength));
    const fixer: number = Math.max(numOneDecimalLength, numTwoDecimalLength);
    return Number(((num1 * adjuster - num2 * adjuster) / adjuster).toFixed(fixer));
  }

  accurateMul(num1: number, num2: number): number {
    const [numOneDecimalLength, numTwoDecimalLength] = this.getDecimalLengthTwoNumbers(num1, num2);
    const adjuster = Math.pow(10, numOneDecimalLength + numTwoDecimalLength);
    const newNum1 = num1 * Math.pow(10, numOneDecimalLength);
    const newNum2 = num2 * Math.pow(10, numTwoDecimalLength);
    return newNum1 * newNum2 / adjuster;
  }

  accurateDiv(num1: number, num2: number) {
    const [numOneDecimalLength, numTwoDecimalLength] = this.getDecimalLengthTwoNumbers(num1, num2);
    const newNum1 = num1 * Math.pow(10, numOneDecimalLength);
    const newNum2 = num2 * Math.pow(10, numTwoDecimalLength);
    const adjuster = Math.pow(10, numTwoDecimalLength - numOneDecimalLength);
    return (newNum1 / newNum2) * adjuster;
  }

  calculateResult(x: number, y: number, operator: string): string {
    let result: string;

    switch (operator) {
      case "+":
        result = this.accurateAdd(x, y).toString();
        break;
      case "-":
        result = this.accurateSubtr(x, y).toString();
        break;
      case "x":
        result = this.accurateMul(x, y).toString();
        break;
      case "÷":
        if (y === 0) return "Can not divided by zero";
        result = this.accurateDiv(x, y).toString();
        break;
      default:
        return "Something wrong with operator";
        break;
    }

    if (Number(result) >= 1e+16) {
      return Number(result).toExponential();
    }

    return result;
  }


}
