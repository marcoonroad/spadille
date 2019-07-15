'use strict'

/* eslint-env node, es6, jest */
/* eslint
  no-new-func: off  */
/* global page */

const LIB_DIR = process.env.LIB_DIR || 'src/spadille/index.js'

if (process.env.BROWSER_ENV) {
  const fs = require('fs')
  const script = fs.readFileSync(`./${LIB_DIR}`)

  module.exports.setup = async function () {
    await page.setJavaScriptEnabled(true)
    await page.goto('file:///dev/null') // this make a "secure context" for crypto.subtle API
    // await page.addScriptTag({ content: script })

    return true
  }

  module.exports.call = async function (closure, ...values) {
    /*
    const prefix = '\t' + script + ';\n\tvar block = '
    const suffix = ';\n\ttry { return await block.bind(spadille)(...arguments); } catch(reason) { throw reason.message; }\n'
    const body = '(async function () {' + prefix + closure.toString() + suffix + '})(...arguments)'
    const modifiedClosure = `function () { return ${body}; }`
    */

    const modifiedClosure = new Function(`
      ${script}
      const block = (${closure.toString()});
      return block.bind(spadille)(...arguments)
        .catch(function (reason) {
          throw reason.message;
        });
    `)

    try {
      return await page.evaluate(modifiedClosure, ...values)
    } catch (reason) {
      throw Error(reason)
    }
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
