'use strict';

/* eslint-env browser, node */
/* eslint
  semi: off */

const {
  isNode, isBrowser
} = require('../utils/environment');

let secret = null;

(function () {
  /* istanbul ignore next */
  if (isBrowser()) {
    secret = require('./browser').init().secret;
  } else if (isNode()) {
    secret = require('./node').init().secret;
  } else {
    throw Error('Could not detect execution context!');
  }
})();

const generate = secret;

module.exports.generate = generate;
