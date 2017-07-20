'use strict'

const http = require('http')
const vm = require('vm')
const concat = require('concat-stream')

let headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Content-Type': 'application/json'
}

module.exports.helloWorld = (event, context, callback) => {
  if (process.env.HOTLOAD === 'true') {
    http.get({
      host: process.env.HOTLOAD_DOMAIN,
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
          headers: headers,
          body: JSON.stringify({
            message: sandbox.module.exports(),
            input: event
          })
        }
        callback(null, response)
      }))
    })
  } else {
    let hello = require('hello')
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        message: hello(),
        input: event
      })
    }
    callback(null, hello())
  }
}
