'use strict';

/* eslint-env node */
/* eslint
  semi: off */

const {
  isNode, isBrowser
} = require('../utils/environment');

let hmac = null;

(function () {
  /* istanbul ignore next */
  if (isBrowser()) {
    hmac = require('./browser').init().hmac;
  } else if (isNode()) {
    hmac = require('./node').init().hmac;
  } else {
    throw Error('Could not detect execution context!');
  }
})();

const sign = hmac;

/*
const verify = async function (secret, signature, message) {
  const result = await hmac(secret, message);

  return signature === result;
};
*/

module.exports.sign = sign;
// module.exports.verify = verify;
