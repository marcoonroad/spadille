/* eslint-env node, es6, jest */

'use strict'

const support = require('../support')

beforeAll(support.setup)

const newSecret = function (length) {
  return support.call(function (length) {
    return this.secret.generate(length)
  }, length)
}

const toBase64 = function (binary) {
  return support.call(function (binary) {
    const sporadic = this
    return new Promise(function (resolve, reject) {
      try {
        resolve(sporadic.encoding.toBase64(binary))
      } catch (reason) {
        reject(reason)
      }
    })
  }, binary)
}

const fromBase64 = function (base64) {
  return support.call(function (base64) {
    const sporadic = this
    return new Promise(function (resolve, reject) {
      try {
        resolve(sporadic.encoding.fromBase64(base64))
      } catch (reason) {
        reject(reason)
      }
    })
  }, base64)
}

it('should generate a random secret', async function () {
  expect.assertions(44)

  for (let length = 4; length < 26; length += 1) {
    const secret = await newSecret(length)
    expect(secret.length).toBe(length)
    expect(secret).toBe(secret.toString())
  }
})

it('should base-64 convert back and forth the secret', async function () {
  expect.assertions(3)

  const secret = await newSecret(16)
  const base64 = await toBase64(secret)

  expect(Buffer.from(secret, 'utf-8').toString('base64')).toBe(base64)
  expect(
    Buffer.from(
      unescape(encodeURIComponent(secret)),
      'ascii'
    ).toString('base64')
  ).toBe(base64)
  await expect(fromBase64(base64)).resolves.toBe(secret)
})
