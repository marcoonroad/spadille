'use strict';

/* eslint-env node */
/* eslint
  comma-dangle: off,
  semi: off */

const hmac = require('../hmac');
const {
  makeRandomGen,
  option,
  splitInPieces,
  computeNumber,
} = require('../utils');

const generate = async function (options) {
  let { secret, payload, minimum, maximum, amount, distinct } = options;

  minimum = option(minimum, 1);
  maximum = option(maximum, 60);
  amount = option(amount, 6);
  distinct = option(distinct, true);

  // interval is inclusive
  if (distinct && amount > maximum - minimum + 1) {
    throw Error(
      'The number of balls [amount] must not be greater than the [(maximum - minimum) + 1] number of RNG when [distinct] flag is on!',
    );
  }

  const seed = await hmac.sign(secret, payload);
  const randomGen = makeRandomGen(minimum, maximum);

  const stream = await splitInPieces(seed);
  const result = [];

  if (distinct) {
    const cache = {};
    let index = 0;
    while (index < amount) {
      const data = await stream.generate();
      const number = computeNumber(randomGen, data);

      // no detected duplicate
      if (!cache[number.toString()]) {
        cache[number.toString()] = true;
        index += 1;
        result.push(number);
      }
    }
  } else {
    for (let index = 0; index < amount; index += 1) {
      const data = await stream.generate();
      const number = computeNumber(randomGen, data);
      result.push(number);
    }
  }
  return result;
};

const permute = async function (options) {
  const { secret, payload, inputSequence } = options;

  const ordering = await generate({
    secret,
    payload,
    minimum: 0,
    maximum: inputSequence.length - 1,
    amount: inputSequence.length,
    distinct: true,
  });

  return ordering.map(index => inputSequence[index]);
};

const pick = async function (options) {
  const { secret, payload, sequence } = options;
  const distinct = option(options.distinct, false);
  const amount = option(options.amount, 1);

  const indexes = await generate({
    secret,
    payload,
    minimum: 0,
    maximum: sequence.length - 1,
    amount,
    distinct,
  });

  return indexes.map(index => sequence[index]);
};

const rand = async function (secret, payload) {
  const maximumInt = Math.pow(2, 31);

  const [randomInt] = await generate({
    secret,
    payload,
    minimum: 0,
    maximum: maximumInt - 1,
    amount: 1,
  });

  return randomInt / maximumInt;
};

module.exports.generate = generate;
module.exports.permute = permute;
module.exports.pick = pick;
module.exports.rand = rand;
