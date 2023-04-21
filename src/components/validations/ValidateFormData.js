export function validateNumber(value, minValue, maxValue) {
  if (value === undefined || value === null || value === "") {
    return false;
  }
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return false;
  }
  if (minValue !== undefined && numberValue < minValue) {
    return false;
  }
  if (maxValue !== undefined && numberValue > maxValue) {
    return false;
  }
  return true;
}

export function validateText(textInputValue) {
  return textInputValue.trim().length > 0 && textInputValue !== "";
}
