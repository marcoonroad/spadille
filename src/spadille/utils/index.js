'use strict';

/* eslint-env node, browser */
/* eslint
  semi: off */

const hmac = require('../hmac');

const cycle = function (number, minimum, maximum) {
  const limit = (maximum + 1) - minimum;
  return minimum + (number % limit);
};

const intXor = function (left, right) {
  return left ^ right;
};

const fromHex = function (hex) {
  return Number.parseInt(hex, 16);
};

const toHex = function (number) {
  return number.toString(16);
}

const generatePiece = async function (hash, suffix) {
  const image = await hmac.sign(hash, suffix.toString());
  const subPieces = [];

  for (let index = 0; index < 64; index += 1) {
    subPieces.push(fromHex(image.substr(index * 8, 8)));
  }

  return toHex(subPieces.reduce(intXor));
};

const computeNumber = function (randomGen, data) {
  return randomGen(Math.abs(fromHex(data)));
};

const splitInPieces = async function (text /*, amount */) {
  const stream = {
    index: -1,
    text: text,
    generate: function () {
      this.index += 1;
      return generatePiece(this.text, this.index);
    }
  };

  return stream;
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

const sortOrder = function (x, y) {
  /* istanbul ignore next */
  return x > y ? 1 : x < y ? -1 : 0;
};

const sortArrayNumber = function (array) {
  return array.sort(sortOrder);
};

module.exports.cycle = cycle;
module.exports.splitInPieces = splitInPieces;
module.exports.fromHex = fromHex;
module.exports.makeRandomGen = makeRandomGen;
module.exports.missing = missing;
module.exports.option = option;
module.exports.sortArrayNumber = sortArrayNumber;
module.exports.computeNumber = computeNumber;
