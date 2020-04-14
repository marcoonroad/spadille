/* istanbul ignore file */

'use strict';

/* eslint-env browser */
/* eslint
  semi: off */

module.exports.init = function () {
  const crypto = window.crypto.subtle;
  const encoder = new TextEncoder('utf-8');
  const HASH = 'SHA-512';

  const num2hex = function (num) {
    return ('00' + num.toString(16)).slice(-2);
  };

  const bin2hex = function (payload) {
    const array = new Uint8Array(payload);
    return [...array].map(num2hex).join('');
  };

  const str2arr = function (str) {
    return encoder.encode(str);
  };

  const importKey = async function (secret, target) {
    const secretParams = str2arr(secret);
    const keyOptions = {
      name: 'HMAC',
      hash: { name: HASH }
    };
    const key = await crypto.importKey('raw', secretParams, keyOptions, false, [target]);
    return key;
  };

  const hmac = async function (secret, message) {
    const payload = str2arr(message);
    const key = await importKey(secret, 'sign');
    const signature = await crypto.sign('HMAC', key, payload);
    return bin2hex(signature);
  };

  return { hmac };
};
