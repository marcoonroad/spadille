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
        'The number of balls [amount] must not be greater than the [maximum - minimum] number of RNG when [distinct] flag is on!'
    })
  }, SECRET, payload)

  expect(failed).toBe(true)
})

it('should pass if the interval is the same of amount when distinct enabled', async function () {
  expect.assertions(1501)

  const payload = cuid()

  const sequence = await support.call(function (secret, payload) {
    return this.prng.generate({
      secret,
      payload,
      minimum: 100,
      maximum: 600,
      amount: 500,
      distinct: true
    })
  }, SECRET, payload)

  sequence.forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(100)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(600)
  })

  expect(sequence.length).toBe(500)
})
