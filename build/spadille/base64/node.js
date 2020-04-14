'use strict';module.exports.init=function(){const toBase64=new Function(`return function (binary) {
    return Buffer.from(binary, 'utf-8').toString('base64');
  };`)();const fromBase64=new Function(`return function (payload) {
    return Buffer.from(payload, 'base64').toString('utf-8');
  };`)();return{toBase64,fromBase64}};