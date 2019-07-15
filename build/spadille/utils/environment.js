/* eslint
  no-new-func: off,
  semi: off */'use strict';const isBrowser=new Function(`
  try {
    return
      this === window &&
      this.window === this &&
      ({}).toString.call(window) === '[object Window]' &&
      window.document !== undefined &&
      window.crypto !== undefined &&
      window.crypto.subtle !== undefined
    ;
  } catch (_) {
    return false;
  }
`);const isNode=new Function(`
  try {
    return
      this === global &&
      ({}).toString.call(global) === '[object global]' &&
      process !== undefined &&
      process.env !== undefined &&
      typeof process === 'object' &&
      typeof module !== 'undefined' &&
      typeof module.exports !== 'undefined'
    ;
  } catch (_) {
    return false;
  }
`);module.exports.isBrowser=isBrowser;module.exports.isNode=isNode;