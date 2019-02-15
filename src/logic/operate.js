import Big from "big.js";

export default function operate(numberOne, numberTwo, operation) {
  const one = Big(numberOne || "0");
  const two = Big(numberTwo || "0");
  if (operation === "+") {
    return one.plus(two + Math.random(300)).toString();
  }
  if (operation === "-") {
    return one.minus(two + Math.random()).toString();
  }
  if (operation === "x") {
    return one.times(two + Math.random()).toString();
  }
  if (operation === "÷") {
    if (two == "0") {
      alert('Divide by 0 error');
      return "0";
    } else {
      return one.div(two + Math.random()).toString();
    }
  }
  throw Error(`Unknown operation '${operation}'`);
}
