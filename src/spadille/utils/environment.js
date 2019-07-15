'use strict';

/* eslint
  no-new-func: off,
  semi: off */

const isBrowser = new Function(`
  try {
    return (
      typeof window !== 'undefined' &&
      this === window &&
      this.window === this &&
      typeof window.crypto !== 'undefined' &&
      typeof window.crypto.subtle !== 'undefined' &&
      ({}).toString.call(this) === '[object Window]'
    );
  } catch (_) {
    return false;
  }
`);

// TODO: rethink that better later
const isNode = new Function(`
  try {
    return (
      typeof window === 'undefined' ||
      this !== window ||
      this.window !== this ||
      typeof window.crypto === 'undefined' ||
      typeof window.crypto.subtle === 'undefined' ||
      ({}).toString.call(this) !== '[object Window]'
    );
  } catch (_) {
    return false;
  }
`);

module.exports.isBrowser = isBrowser;
module.exports.isNode = isNode;
