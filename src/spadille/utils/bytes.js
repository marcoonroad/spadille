/* istanbul ignore file */

'use strict'

/* eslint semi: off */

const fromString = function (text) {
  const encoder = new TextEncoder()
  const buffer = encoder.encode(text)
  const list = JSON.parse(`[${buffer.toString()}]`)
  const array = new Uint8Array(list.length)
  list.forEach(function (value, index) {
    array[index] = value
  })
  return array
}

const toString = function (bytes, encoding) {
  encoding = encoding || 'utf-8'
  const decoder = new TextDecoder(encoding)
  return decoder.decode(bytes)
}

module.exports.fromString = fromString
module.exports.toString = toString
