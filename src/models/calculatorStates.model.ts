export class CalculatorRecord {
    constructor(
        public previousOperand: string,
        public currentOperand: string,
        public operator: string,
        public result: string,
        public id?: string,
    ){}
}
