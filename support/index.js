/* eslint-env node, es6, jest */
/* eslint
  semi: off */

'use strict'

const preload = function () {
  const LIB_DIR = process.env.LIB_DIR || 'src/spadille'

  if (process.env.BROWSER_ENV) {
    const fs = require('fs')
    const script = fs.readFileSync(`./${LIB_DIR}`)
    const { JSDOM } = require('jsdom')
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title></title>
          <script>${script}</script>
        </head>
        <body>
        </body>
      </html>
    `, {
      runScripts: 'dangerously',
      resources: 'usable'
    })
    return dom.window.spadille
  }

  return require(`../${LIB_DIR}`)
}

module.exports.spadille = preload()
