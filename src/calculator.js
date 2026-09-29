import { api } from './api.js';
import { toggleSign, displayExpression } from './expression.js';

export function initCalculator(onSuccess) {
  const input = document.querySelector('#expression');
  const output = document.querySelector('#result');
  const message = document.querySelector('#calculation-message');
  const note = document.querySelector('#result-note');
  const copy = document.querySelector('#copy-result');
  const calculateButton = document.querySelector('#calculate');
  let busy = false;
  let revision = 0;
  let result = null;
  let solved = false;

  function edited() {
    revision += 1;
    solved = false;
    result = null;
    output.textContent = '—';
    note.textContent = 'Press enter or calculate';
    copy.disabled = true;
    message.textContent = '';
  }

  function setExpression(value) {
    input.value = displayExpression(value).slice(0, 200);
    edited();
  }

  function insert(value) {
    if (solved && /^[0-9.(]$/.test(value)) input.value = '';
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const next = input.value.slice(0, start) + displayExpression(value) + input.value.slice(end);
    if (next.length > 200) return;
    input.value = next;
    input.setSelectionRange(start + value.length, start + value.length);
    edited();
  }

  function backspace() {
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const from = start === end ? Math.max(0, start - 1) : start;
    input.value = input.value.slice(0, from) + input.value.slice(end);
    input.setSelectionRange(from, from);
    edited();
  }

  function clear() {
    setExpression('');
    output.textContent = '0';
    note.textContent = 'Your next idea starts here';
  }

  async function calculate() {
    if (busy) return;
    if (!input.value.trim()) {
      message.textContent = 'Enter an expression first.';
      input.focus();
      return;
    }
    const submitted = input.value;
    const submittedRevision = revision;
    busy = true;
    calculateButton.disabled = true;
    calculateButton.firstElementChild.textContent = 'Calculating…';
    result = null;
    copy.disabled = true;
    output.textContent = '…';
    message.textContent = '';
    try {
      const data = await api.calculate(submitted);
      // A response to an old edit must never replace the current expression's display.
      if (revision === submittedRevision) {
        result = data.result;
        output.textContent = data.result;
        note.textContent = 'Calculated & saved';
        copy.disabled = false;
        solved = true;
      }
      await onSuccess();
    } catch (error) {
      if (revision === submittedRevision) {
        output.textContent = '—';
        note.textContent = 'Let’s try that again';
        message.textContent = error.message;
      }
    } finally {
      busy = false;
      calculateButton.disabled = false;
      calculateButton.firstElementChild.textContent = 'Calculate';
    }
  }

  input.addEventListener('input', edited);
  document.querySelector('.keypad').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.value) insert(button.dataset.value);
    const actions = {
      clear,
      backspace,
      calculate,
      sign: () => setExpression(toggleSign(input.value)),
    };
    actions[button.dataset.action]?.();
  });
  copy.addEventListener('click', async () => {
    if (result === null) return;
    try {
      await navigator.clipboard.writeText(result);
      copy.textContent = 'Copied ✓';
      setTimeout(() => {
        copy.textContent = 'Copy result ↗';
      }, 1800);
    } catch {
      message.textContent = 'Copy is unavailable here. Select the result to copy it manually.';
    }
  });
  return { calculate, insert, backspace, clear, setExpression };
}
