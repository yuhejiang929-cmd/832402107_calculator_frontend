// Text transformations only. All arithmetic belongs to the backend.
export function displayExpression(value) {
  return value.replaceAll('*', '×').replaceAll('/', '÷');
}

export function toggleSign(value) {
  const text = value.trim();
  if (!text) return '-';
  if (/^-[0-9.]+$/.test(text)) return text.slice(1);
  if (/^[0-9.]+$/.test(text)) return `-${text}`;
  // Compound input is wrapped as one operand; repeated presses add another negation.
  return `-(${text})`;
}
