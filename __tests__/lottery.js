/* eslint-env node, es6, jest */
/* eslint
  semi: off */

'use strict'

const cuid = require('cuid')
let support = require('../support')
// let brazillian = null
// const { brazillian } = support.spadille.lottery
const SECRET = 'OH NO!'

/*
beforeAll(async function () {
  support.spadille = await support.spadille()
  brazillian = support.spadille.lottery.brazillian
  return true
})
*/

beforeAll(support.setup)

it('should generate a mega sena sequence', async function () {
  expect.assertions(20)

  const payload = cuid()

  const sequence = await support.call(function (secret, payload) {
    return this.lottery.brazillian.megaSena(secret, payload)
  }, SECRET, payload)

  const uniqueness = {}

  sequence.forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(1)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(60)
    uniqueness[number.toString()] = true
  });

  expect(sequence.length).toBe(Object.keys(uniqueness).length)

  const sequenceCopy = await support.call(function (secret, payload) {
    return this.lottery.brazillian.megaSena(secret, payload)
  }, SECRET, payload)

  expect(sequenceCopy).toStrictEqual(sequence)
})

it('should generate a federal sequence', async function () {
  expect.assertions(17)

  const payload = cuid()

  const sequence = await support.call(function (secret, payload) {
    return this.lottery.brazillian.federal(secret, payload)
  }, SECRET, payload)

  const sequenceCopy = await support.call(function (secret, payload) {
    return this.lottery.brazillian.federal(secret, payload)
  }, SECRET, payload)

  expect(sequenceCopy).toStrictEqual(sequence)
  expect(sequence.length).toBe(5)

  sequence.split('').map(Number).forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(0)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(9)
  })
})
