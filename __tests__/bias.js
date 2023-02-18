/* eslint-env node, es6, jest */

'use strict'

const cuid = require('cuid')
const support = require('../support')
const SECRET = 'FAKE NEWS!'

beforeAll(support.setup)

// WARNING: non-deterministic test, might fail sometimes,
// has minimum acceptance threshold of ocurrence/probability
// for every event in the given interval of points
const measureBias = async function (options) {
  const { MINIMUM, MAXIMUM, THRESHOLD } = options
  const ELEMENTS = MAXIMUM - MINIMUM
  const ITERATIONS = ELEMENTS * (1 / THRESHOLD)
  const generated = []

  for (let index = 0; index < ELEMENTS; index += 1) {
    generated[index] = false
  }

  for (let index = 0; index < ITERATIONS; index += 1) {
    const payload = cuid()

    const sequence = await support.call(
      function (secret, payload, minimum, maximum) {
        return this.prng.generate({
          secret,
          payload,
          minimum: minimum,
          maximum: maximum,
          amount: 1,
          distinct: false
        })
      },
      SECRET,
      payload,
      MINIMUM,
      MAXIMUM
    )

    const index = sequence[0] - MINIMUM
    generated[index] = true
  }

  const nonBiased = generated.reduce((left, right) => {
    return left && right
  }, true)

  return !nonBiased
}

it('should generate non-biased numbers', async function () {
  expect.assertions(1)

  const biased = await measureBias({
    MINIMUM: 1,
    MAXIMUM: 6,
    THRESHOLD: 0.2
  })

  expect(biased).toBe(false)
})

it('should generate non-biased huge numbers', async function () {
  expect.assertions(1)

  const biased = await measureBias({
    MINIMUM: 49999955,
    MAXIMUM: 50000000,
    THRESHOLD: 0.1
  })

  expect(biased).toBe(false)
}, 10000)
