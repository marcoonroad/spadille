/* eslint-env node, es6, jest */
/* eslint
  semi: off */

'use strict'

const cuid = require('cuid')
let support = require('../support')
const SECRET = 'OH YES!'

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

  const sequencePromise = support.call(function (secret, payload) {
    return this.prng.generate({
      secret,
      payload,
      minimum: 7,
      maximum: 10,
      amount: 5,
      distinct: true
    })
  }, SECRET, payload)

  try {
    await sequencePromise
    throw Error('Expected to fail on promise for arbitrary sequence!')
  } catch (reason) {
    // we match cause the puppeteer wraps errors in a custom object
    expect(reason.toString()).toMatch(
      /The number of balls \[amount\] must be lower than the \[maximum - minimum\] number of RNG when \[distinct\] flag is on!/
    )
  }
})
