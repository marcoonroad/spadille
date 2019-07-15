'use strict';

/* eslint-env node */
/* eslint
  semi: off */

module.exports.init = function () {
  const crypto = require('crypto');
  const HASH = 'sha512';

  const hmac = async function (secret, message) {
    const hash = crypto.createHmac(HASH, secret);

    hash.update(message);
    return hash.digest('hex');
  };

  return { hmac };
};
