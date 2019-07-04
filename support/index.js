/* eslint-env node, es6, jest */
/* eslint
  no-new-func: off,
  semi: off */
/* global page */

'use strict'

const LIB_DIR = process.env.LIB_DIR || 'src/spadille/index.js'

/*
const preload = async function () {
  if (process.env.BROWSER_ENV) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title></title>
        </head>
        <body>
        </body>
      </html>
    `
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(true)
    await page.setContent(html)
    // await page.addScriptTag({ path: require.resolve(`../${LIB_DIR}`) })
    // await page.addScriptTag({ content: script })

    const context = function (script) {
      const closure = new Function(script + '; return spadille;');
      return closure();
    };

    await page.evaluate(context, script)
    await page.waitForFunction(
      ([
        'window.spadille !== undefined',
        'window.spadille.lottery !== undefined',
        'window.spadille.prng !== undefined',
        'window.spadille.lottery.brazillian !== undefined',
        'typeof window.spadille.prng.generate === "function"',
        'typeof window.spadille.lottery.brazillian.megaSena === "function"',
        'typeof window.spadille.lottery.brazillian.federal === "function"'
      ]).join(' && ')
    )
    const lib = await page.evaluate(() => window.spadille)
    return lib
  }

  return require(`../${LIB_DIR}`)
}

module.exports.spadille = preload
*/

if (process.env.BROWSER_ENV) {
  const fs = require('fs')
  const script = fs.readFileSync(`./${LIB_DIR}`)

  module.exports.setup = async function () {
    /*
    const htmlDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Spadille Test Suite</title>
        </head>
        <body>
        </body>
      </html>
    `
    */

    await page.setJavaScriptEnabled(true)
    // await page.setContent(htmlDocument)
    await page.goto('file:///dev/null') // this make a "secure context" for crypto.subtle API
    // await page.addScriptTag({ path: require.resolve(`../${LIB_DIR}`) })
    // await page.addScriptTag({ content: script })

    /*
    const context = function (script) {
      const closure = new Function(script + '; return spadille;');
      return closure();
    };

    await page.evaluate(context, script)
    */
    // await page.waitForFunction('window.spadille !== undefined')
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
