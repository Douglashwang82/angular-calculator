export function calculateResult(x: number, y: number, operator: string): string {
    let result:number = 0;
    x = x;
    y = y;
    switch (operator) {
        case "+":
            result = x + y;
            break;
        case "-":
            result = x - y;
            break;
        case "x":
            result = x * y;
            break;
        case "÷":
            if (y === 0) return "Can not divided by zero";
            result = x / y;
            break;
        default:
            return "Something wrong with operator";
            break;
    }
    result = result / 10;
    if (result >= 1e+16) {
        return result.toExponential();
    }
    return Math.floor(result).toString();
}
