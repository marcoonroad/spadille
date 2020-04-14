/* eslint-env node, es6, jest */

'use strict'

const support = require('../support')

beforeAll(support.setup)

const newSecret = function (length) {
  return support.call(function (length) {
    return this.secret.generate(length)
  }, length)
}

const encode = function (binary) {
  return support.call(function (binary) {
    const sporadic = this
    return new Promise(function (resolve, reject) {
      try {
        resolve(sporadic.base64.encode(binary))
      } catch (reason) {
        reject(reason)
      }
    })
  }, binary)
}

const decode = function (data) {
  return support.call(function (data) {
    const sporadic = this
    return new Promise(function (resolve, reject) {
      try {
        resolve(sporadic.base64.decode(data))
      } catch (reason) {
        reject(reason)
      }
    })
  }, data)
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
  const base64 = await encode(secret)

  expect(Buffer.from(secret, 'utf-8').toString('base64')).toBe(base64)
  expect(
    Buffer.from(
      unescape(encodeURIComponent(secret)),
      'ascii'
    ).toString('base64')
  ).toBe(base64)
  await expect(decode(base64)).resolves.toBe(secret)
})

it('should fail to encode/decode invalid base64 data', async function () {
  expect.assertions(3)

  await expect(decode('*&@%@#$%')).rejects.toMatchObject({
    message: 'Failed to decode base-64 data into binary!'
  })

  await expect(encode('')).rejects.toMatchObject({
    message: 'Failed to encode binary data as base-64!'
  })

  await expect(decode('')).rejects.toMatchObject({
    message: 'Failed to decode base-64 data into binary!'
  })
})
