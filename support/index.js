/* eslint-env node, es6, jest */
/* eslint
  no-new-func: off,
  semi: off */
/* global page */

'use strict'

const LIB_DIR = process.env.LIB_DIR || 'src/spadille/index.js'

if (process.env.BROWSER_ENV) {
  const fs = require('fs')
  const script = fs.readFileSync(`./${LIB_DIR}`)

  module.exports.setup = async function () {
    await page.setJavaScriptEnabled(true)
    await page.goto('file:///dev/null') // this make a "secure context" for crypto.subtle API

    return true
  }

  module.exports.call = function (closure, ...values) {
    const prefix = '\t' + script + ';\n\tvar block = '
    const suffix = ';\n\treturn block.bind(spadille)(...arguments);'
    const modifiedClosure = new Function(prefix + closure.toString() + suffix)
    return page.evaluate(modifiedClosure, ...values)
  }
} else {
  module.exports.setup = async function () {
    require(`../${LIB_DIR}`) // test if loads OK
    return true
  }

  module.exports.call = function (closure, ...values) {
    const __spadille__ = require(`../${LIB_DIR}`)
    return closure.bind(__spadille__)(...values)
  }
}
