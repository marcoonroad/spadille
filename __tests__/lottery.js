/* eslint-env node, es6, jest */

'use strict'

const cuid = require('cuid')
const support = require('../support')
const SECRET = 'OH NO!'

beforeAll(support.setup)

it('should generate a mega sena sequence', async function () {
  expect.assertions(22)

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
  })

  expect(sequence.length).toBe(Object.keys(uniqueness).length)
  expect(sequence.length).toBe(6)

  const sequenceCopy = await support.call(function (secret, payload) {
    return this.lottery.brazillian.megaSena(secret, payload)
  }, SECRET, payload)

  expect(sequenceCopy).toStrictEqual(sequence)

  const orderedSequence = sequence.sort(function (x, y) {
    return x - y
  })

  expect(orderedSequence).toStrictEqual(sequence)
})

it('should match the fixed mega-sena sequence', async function () {
  expect.assertions(1)

  const fixedSequence = [1, 13, 18, 22, 55, 60]
  const payload = '[fixed payload data]'

  const sequence = await support.call(function (secret, payload) {
    return this.lottery.brazillian.megaSena(secret, payload)
  }, SECRET, payload)

  expect(sequence).toStrictEqual(fixedSequence)
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

it('should match the fixed federal sequence', async function () {
  expect.assertions(1)

  const fixedSequence = '74901'
  const payload = '[fixed payload data]'

  const sequence = await support.call(function (secret, payload) {
    return this.lottery.brazillian.federal(secret, payload)
  }, SECRET, payload)

  expect(sequence).toStrictEqual(fixedSequence)
})
