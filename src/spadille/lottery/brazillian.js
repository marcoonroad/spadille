/* eslint-env node, browser */
/* eslint
  semi: off */

'use strict';

const prng = require('../prng');

// unique six numbers from 1 up to 60, default case
const megaSena = function (secret, payload) {
  return prng.generate({ secret, payload });
};

// numbers between 00000 and 99999
const federal = async function (secret, payload) {
  const sequence = await prng.generate({
    secret,
    payload,
    minimum: 0,
    maximum: 9,
    amount: 5,
    distinct: false
  });

  return sequence.map(function (number) {
    return number.toString();
  }).join('');
};

module.exports.megaSena = megaSena;
module.exports.federal = federal;
