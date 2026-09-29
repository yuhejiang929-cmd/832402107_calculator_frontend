import './styles.css';
import { initCalculator } from './calculator.js';
import { initHistory } from './history.js';
import { initKeyboard } from './keyboard.js';
import { initTheme } from './theme.js';

initTheme();
let calculator;
const history = initHistory((expression) => calculator.setExpression(expression));
calculator = initCalculator(history.reload);
initKeyboard(calculator);
