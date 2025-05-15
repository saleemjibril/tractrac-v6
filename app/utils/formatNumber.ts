export default function formatNumber(numberString: string) {
  const number = parseFloat(numberString); // Convert the string to a number

  if (isNaN(number)) {
    // Handle invalid input (e.g., non-numeric strings)
    return "0";
  }

  if (number >= 1000000) {
    // Format numbers in millions as "X.Xm"
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 99999) {
    // Format numbers in thousands with commas
    return (number / 1000).toLocaleString() + "K";
  } else {
    // Numbers below 1000 remain the same with commas
    return number.toLocaleString();
  }
}