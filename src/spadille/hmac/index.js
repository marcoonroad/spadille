/* eslint-env node, browser */
/* eslint semi: off */

let hmac = null;

(function () {
  try {
    if (window === undefined && document === undefined) {
      hmac = require('./node').init().hmac;
    } else {
      hmac = require('./browser').init().hmac;
    }
  } catch (_) {
    hmac = require('./node').init().hmac;
  }
})();

const sign = hmac;

const verify = async function (secret, signature, message) {
  const result = await hmac(secret, message);

  return signature === result;
};

module.exports.sign = sign;
module.exports.verify = verify;
