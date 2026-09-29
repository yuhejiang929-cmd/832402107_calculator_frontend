import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleSign, displayExpression } from '../src/expression.js';

test('sign changes only expression text', () => {
  assert.equal(toggleSign('5'), '-5');
  assert.equal(toggleSign('-5'), '5');
  assert.equal(toggleSign('3*-2'), '-(3*-2)');
  assert.equal(toggleSign(''), '-');
});
test('operator display preserves the expression', () => {
  assert.equal(displayExpression('(1+2)*3/4'), '(1+2)×3÷4');
});
