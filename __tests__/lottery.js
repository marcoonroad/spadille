/* eslint-env node, es6, jest */
/* eslint
  semi: off */

'use strict'

const cuid = require('cuid')
const support = require('../support')
const { brazillian } = support.spadille.lottery
const secret = 'OH NO!'

it('should generate a mega sena sequence', async function () {
  expect.assertions(20)

  const payload = cuid()
  const sequence = await brazillian.megaSena(secret, payload)

  const uniqueness = {}

  sequence.forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(1)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(60)
    uniqueness[number.toString()] = true
  });

  expect(sequence.length).toBe(Object.keys(uniqueness).length)

  const sequenceCopy = await brazillian.megaSena(secret, payload)
  expect(sequenceCopy).toStrictEqual(sequence)
})

it('should generate a federal sequence', async function () {
  expect.assertions(17)

  const payload = cuid()
  const sequence = await brazillian.federal(secret, payload)
  const sequenceCopy = await brazillian.federal(secret, payload)

  expect(sequenceCopy).toStrictEqual(sequence)
  expect(sequence.length).toBe(5)

  sequence.split('').map(Number).forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(0)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(9)
  })
})
