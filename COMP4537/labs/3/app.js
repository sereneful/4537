const MathOperations = require('./math');

const mathOps = new MathOperations();

const num1 = 10;
const num2 = 5;

const sum = mathOps.add(num1, num2);
const difference = mathOps.subtract(num1, num2);

console.log(`Hello Markus. The sum is ${sum} and the difference is ${difference}.`);
