/* eslint-env node */
/* eslint
  semi: off */

const hmac = require('../hmac');
const {
  fromHex,
  makeRandomGen,
  option,
  splitInPieces
} = require('../utils');

const generate = async function (options) {
  let {
    secret,
    payload,
    minimum,
    maximum,
    amount,
    distinct
  } = options;

  minimum = option(minimum, 1);
  maximum = option(maximum, 60);
  amount = option(amount, 6);
  distinct = option(distinct, true);

  if (distinct && amount >= maximum) {
    throw Error(
      'The number of balls [amount] must be lower than the [maximum] number of RNG when [distinct] flag is on!'
    );
  }

  const seed = await hmac.sign(secret, payload);
  const parts = splitInPieces(seed, amount);
  const randomGen = makeRandomGen(minimum, maximum);

  const additional = randomGen(fromHex(parts.rest));

  parts.pieces = parts.pieces
    .map(fromHex)
    .map(randomGen)
    .map(function (number) { return number + additional; })
    .map(randomGen);

  if (distinct) {
    const result = [];
    const cache = {};
    parts.pieces.forEach(function (value) {
      let number = value;

      // deduplicate
      while (cache[number.toString()]) {
        number = randomGen(number * additional);
      }

      cache[number.toString()] = true;
      result.push(number);
    });

    return result;
  } else {
    return parts.pieces;
  }
};

module.exports.generate = generate;
