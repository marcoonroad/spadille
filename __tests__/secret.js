/* eslint-env node, es6, jest */

'use strict'

const support = require('../support')

beforeAll(support.setup)

it('should generate a random secret', async function () {
  expect.assertions(22)

  const newSecret = function (length) {
    return support.call(function (length) {
      return this.secret.generate(length)
    }, length)
  }

  for (let length = 4; length < 26; length += 1) {
    const secret = await newSecret(length)
    expect(secret.length).toBe(length)
  }
})
