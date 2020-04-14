'use strict';module.exports.init=function(){return{toBase64:new Function(`return function (binary) {
      return btoa (unescape (encodeURIComponent (binary)));
    }`)(),fromBase64:new Function(`return function (base64) {
      return decodeURIComponent (escape (atob (base64)));
    }`)()}};