/* eslint-env node, es6, jest */

'use strict'

const cuid = require('cuid')
const support = require('../support')
const SECRET = 'YAY!'

beforeAll(support.setup)

it('should generate arbitrary/huge luck numbers', async function () {
  expect.assertions(1501)

  const payload = cuid()

  const sequence = await support.call(function (secret, payload) {
    return this.prng.generate({
      secret,
      payload,
      minimum: 30,
      maximum: 9000,
      amount: 500,
      distinct: false
    })
  }, SECRET, payload)

  sequence.forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(30)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(9000)
  })

  expect(sequence.length).toBe(500)
})

it('should not enter in infinite loop while', async function () {
  expect.assertions(1)

  const payload = cuid()

  const failed = await support.call(function (secret, payload) {
    return this.prng.generate({
      secret,
      payload,
      minimum: 7,
      maximum: 10,
      amount: 5,
      distinct: true
    }).then(function () {
      return false
    }).catch(function (reason) {
      return reason.message ===
        'The number of balls [amount] must not be greater than the [(maximum - minimum) + 1] number of RNG when [distinct] flag is on!'
    })
  }, SECRET, payload)

  expect(failed).toBe(true)
})

it('should pass if the interval is the same of amount when distinct enabled', async function () {
  expect.assertions(151)

  const payload = cuid()

  const sequence = await support.call(function (secret, payload) {
    return this.prng.generate({
      secret,
      payload,
      minimum: 11,
      maximum: 60,
      amount: 50,
      distinct: true
    })
  }, SECRET, payload)

  sequence.forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(11)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(60)
  })

  expect(sequence.length).toBe(50)
}, 35000)

it('should shuffle a list', async function () {
  expect.assertions(22)

  const payload = cuid()

  const inputSequence = [ 1, 2, 3, 4, 5, 6, 7 ]
  const outputSequence = await support.call(function (secret, payload, inputSequence) {
    return this.prng.permute({
      secret,
      payload,
      inputSequence
    })
  }, SECRET, payload, inputSequence)

  outputSequence.forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(1)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(7)
  })

  expect(outputSequence.length).toBe(7)
})
