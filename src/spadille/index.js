/* eslint-env node */
/* eslint semi: off */

const hmac = require('./hmac');

const cycle = function (amount, minimum, maximum) {
  const limit = (maximum + 1) - minimum;
  return minimum + (amount % limit);
};

const pieces = function (hash, amount) {
  const size = Number.parseInt(hash.length / amount);
  const pieces = [];

  for (let index = 0; index < amount; index += 1) {
    const piece = hash.substr(index * size, size);
    pieces.push(piece);
  }

  const rest = hash.substr(pieces * amount) || '11';

  return { pieces, rest };
};

const fromHex = function (hex) {
  return Number.parseInt(hex, 16);
};

const random60 = function (seed) {
  return cycle(seed, 1, 60);
};

const randomLimit = function (limit) {
  return function (seed) {
    return cycle(seed, 1, limit);
  };
};

const generate = async function (seed, limit, balls) {
  if (balls >= limit) {
    throw Error('The number of balls must be lower than the limit of RNG!');
  }

  const hash = await hmac.sign(seed, seed);
  const parts = pieces(hash, balls);
  const randomGen = randomLimit(limit);

  const plus = randomGen(fromHex(parts.rest));

  parts.pieces = parts.pieces
    .map(fromHex)
    .map(randomGen)
    .map(function (number) { return plus + number; })
    .map(randomGen);

  const cache = {};
  const result = [];
  parts.pieces.forEach(function (value) {
    let number = value;

    // deduplicate
    while (cache[number.toString()]) {
      number = randomGen(number * plus);
    }

    cache[number.toString()] = true;
    result.push(number);
  });

  return result;
};

module.exports.pieces = pieces;
module.exports.cycle = cycle;
module.exports.fromHex = fromHex;
module.exports.random60 = random60;
module.exports.generate = generate;
