export function initKeyboard(calculator) {
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
    if (document.querySelector('dialog[open]')) return;
    const target = event.target;
    const isExpression = target.id === 'expression';
    if (!isExpression && (target.matches('input, textarea, select') || target.isContentEditable))
      return;
    if (event.key === 'Enter' || event.key === '=') {
      if (event.key === 'Enter' && target.closest('button')) return;
      event.preventDefault();
      calculator.calculate();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      calculator.clear();
    } else if (!isExpression && event.key === 'Backspace') {
      event.preventDefault();
      calculator.backspace();
    } else if (!isExpression && /^[0-9.+*/()\-]$/.test(event.key)) {
      event.preventDefault();
      calculator.insert(event.key);
    }
  });
}
