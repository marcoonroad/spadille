/* eslint-env node, es6, jest */
/* eslint
  semi: off */

'use strict'

const cuid = require('cuid')
const support = require('../support')
const secret = 'OH YES!'

it('should generate arbitrary/huge luck numbers', async function () {
  expect.assertions(1501)
  const payload = cuid()

  const sequence = await support.spadille.prng.generate({
    secret,
    payload,
    minimum: 30,
    maximum: 9000,
    amount: 500,
    distinct: false
  })

  sequence.forEach(function (number) {
    expect(number).toBeGreaterThanOrEqual(30)
    expect(number).toBe(Number.parseInt(number))
    expect(number).toBeLessThanOrEqual(9000)
  })

  expect(sequence.length).toBe(500)
})
