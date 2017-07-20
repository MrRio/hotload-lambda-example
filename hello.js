'use strict'
const cp = require('child_process')

let hello = () => {
  return cp.execSync('uname -a') + ''
  // return 'This is a test -- how you doing?'
}
module.exports = hello
