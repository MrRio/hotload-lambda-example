'use strict'

const http = require('http')
const vm = require('vm')
const concat = require('concat-stream')

module.exports.helloWorld = (event, context, callback) => {
  http.get({
    host: '5da167ab.ngrok.io',
    port: 80,
    path: '/hello.js'
  },
  res => {
    res.setEncoding('utf8')
    res.pipe(concat({ encoding: 'string' }, remoteSrc => {
      const script = new vm.Script(remoteSrc)
      let sandbox = {
        module: {
          exports: null
        },
        require: require
      }
      script.runInNewContext(sandbox)
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: sandbox.module.exports(),
          input: event
        })
      }
      callback(null, response)
    }))
  })
}
