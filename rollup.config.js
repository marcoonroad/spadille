'use strict'

const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const terser = require('rollup-plugin-terser').terser
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')

module.exports = {
  input: 'src/spadille/index.js',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    name: 'spadille',
    compact: true,
    exports: 'named',
    globals: {
      'crypto': 'crypto'
    }
  },
  external: ['crypto'],
  plugins: [
    builtins({ crypto: true }),
    globals(),
    nodeResolve({
      // module: true,
      // main: true,
      mainFields: ['module', 'main'],
      browser: true
    }),
    commonjs({
      exclude: ['node_modules/**'],
      sourceMap: false
    }),
    terser({
      sourcemap: false
    })
  ]
}
