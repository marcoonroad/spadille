'use strict';

/* eslint-env browser, node */
/* eslint
  semi: off */

const {
  isNode, isBrowser
} = require('../utils/environment');

let encoding = null;

const wrapErrors = function (encoding) {
  const result = {};

  result.toBase64 = function (binary) {
    try {
      const payload = encoding.toBase64(binary);
      if (payload) {
        return payload
      }
      throw Error('< error ignored >');
    } catch (reason) {
      throw reason;
      // throw Error('Failed to encode binary data as base-64!');
    }
  };

  result.fromBase64 = function (payload) {
    try {
      const binary = encoding.fromBase64(payload);
      if (binary) {
        return binary;
      }
      throw Error('< error ignored >');
    } catch (reason) {
      throw reason;
      // throw Error('Failed to decode base-64 data into binary!');
    }
  };

  return result;
};

(function () {
  /* istanbul ignore next */
  if (isBrowser()) {
    encoding = require('./browser').init();
  } else if (isNode()) {
    encoding = require('./node').init();
  } else {
    throw Error('Could not detect execution context!');
  }
})();

encoding = wrapErrors(encoding)
module.exports.toBase64 = encoding.toBase64;
module.exports.fromBase64 = encoding.fromBase64;
