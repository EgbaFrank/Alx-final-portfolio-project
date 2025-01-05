export default function roundToDecimal(value, decimal = 2) {
  if (typeof value !== 'number') {
    console.warn(`Value ${value} is not a number, returning as is`);
    return value;
  }
  return Number(value.toFixed(decimal));
}
