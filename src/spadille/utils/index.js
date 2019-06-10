/* eslint-env node, browser */
/* eslint
  semi: off */

'use strict';

const cycle = function (number, minimum, maximum) {
  const limit = (maximum + 1) - minimum;
  return minimum + (number % limit);
};

const splitInPieces = function (text, amount) {
  const pieceSize = Number.parseInt(text.length / amount);
  const pieces = [];

  for (let index = 0; index < amount; index += 1) {
    const piece = text.substr(index * pieceSize, pieceSize);
    pieces.push(piece);
  }

  const rest = text.substr(pieces * amount) || '11';

  return { pieces, rest };
};

const fromHex = function (hex) {
  return Number.parseInt(hex, 16);
};

const makeRandomGen = function (minimum, maximum) {
  return function (seed) {
    return cycle(seed, minimum, maximum);
  };
};

const missing = function (value) {
  return value === undefined || value === null;
};

const option = function (value, defaultValue) {
  return missing(value) ? defaultValue : value;
};

module.exports.cycle = cycle;
module.exports.splitInPieces = splitInPieces;
module.exports.fromHex = fromHex;
module.exports.makeRandomGen = makeRandomGen;
module.exports.missing = missing;
module.exports.option = option;
