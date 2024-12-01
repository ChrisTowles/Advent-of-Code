// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './test-01/test-01'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})