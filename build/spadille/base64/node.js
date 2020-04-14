'use strict';/* eslint
  no-new-func: off,
  semi: off *//* eslint-env node */module.exports.init=function(){// NOTE: eval is a workaround for Rollup bogus behavior injecting
// variable browser-undefined module into bundle build context
const toBase64=new Function(`return function (binary) {
    return Buffer.from(binary, 'utf-8').toString('base64');
  };`)();const fromBase64=new Function(`return function (payload) {
    return Buffer.from(payload, 'base64').toString('utf-8');
  };`)();return{toBase64,fromBase64}};