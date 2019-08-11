/* istanbul ignore file */

'use strict';

/* eslint
  no-new-func: off,
  semi: off */
/* eslint-env browser */

module.exports.init = function () {
  const Bytes = require('../utils/bytes');
  const crypto = window.crypto;

  const secret = async function (bytes) {
    const buffer = crypto.getRandomValues(new Uint8Array(bytes));
    return Bytes.toString(buffer, 'ascii');
  };

  return { secret };
};
