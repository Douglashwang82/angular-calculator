function getDecimalLengthTwoNumbers(num1: number, num2: number): [number, number] {
    const numOneDecimalPart: string = num1.toString().split('.')[1];
    const numTwoDecimalPart: string = num2.toString().split('.')[1];
    const numOneDecimalLength: number = numOneDecimalPart ? numOneDecimalPart.length : 0;
    const numTwoDecimalLength: number = numTwoDecimalPart ? numTwoDecimalPart.length : 0;
    return [numOneDecimalLength, numTwoDecimalLength]
}

function accurateAdd(num1: number, num2: number): number {
    const [numOneDecimalLength, numTwoDecimalLength]: [number, number] = getDecimalLengthTwoNumbers(num1, num2);
    const adjuster: number = Math.pow(10, Math.max(numOneDecimalLength, numTwoDecimalLength));
    return (num1 * adjuster + num2 * adjuster) / adjuster;
}

function accurateSubtr(num1: number, num2: number): number {
    const [numOneDecimalLength, numTwoDecimalLength]: [number, number] = getDecimalLengthTwoNumbers(num1, num2);
    const adjuster: number = Math.pow(10, Math.max(numOneDecimalLength, numTwoDecimalLength));
    const fixer: number = Math.max(numOneDecimalLength, numTwoDecimalLength);
    return Number(((num1 * adjuster - num2 * adjuster) / adjuster).toFixed(fixer));
}

function accurateMul(num1: number, num2: number): number {
    const [numOneDecimalLength, numTwoDecimalLength] = getDecimalLengthTwoNumbers(num1, num2);
    const adjuster = Math.pow(10, numOneDecimalLength + numTwoDecimalLength);
    const newNum1 = num1 * Math.pow(10, numOneDecimalLength);
    const newNum2 = num2 * Math.pow(10, numTwoDecimalLength);
    return  newNum1 * newNum2/ adjuster;
}

function accurateDiv(num1: number, num2: number) {
    const [numOneDecimalLength, numTwoDecimalLength] = getDecimalLengthTwoNumbers(num1, num2);
    const newNum1 = num1 * Math.pow(10, numOneDecimalLength);
    const newNum2 = num2 * Math.pow(10, numTwoDecimalLength);
    const adjuster = Math.pow(10, numTwoDecimalLength - numOneDecimalLength);
    return (newNum1 / newNum2) * adjuster;
}





export function calculateResult(x: number, y: number, operator: string): string {
    let result: string;

    switch (operator) {
        case "+":
            result = accurateAdd(x, y).toString();
            break;
        case "-":
            result = accurateSubtr(x, y).toString();
            break;
        case "x":
            result = accurateMul(x, y).toString();
            break;
        case "÷":
            if (y === 0) return "Can not divided by zero";
            result = accurateDiv(x, y).toString();
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

