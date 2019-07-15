'use strict';

/* eslint
  semi: off */
/* eslint-env browser */

module.exports.init = function () {
  const crypto = require('crypto');

  const secret = async function (bytes) {
    const buffer = crypto.randomBytes(bytes);
    return buffer.toString('ascii');
  };

  return { secret };
};
