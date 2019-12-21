// Just testing

const {
    // inputs,
    outputs,
    outputOptions,
    inputOptions,
    options
} = require('./build.config.js')

const build = require('./build.js')

// console.log(options, outputs, outputOptions, inputOptions)

build(options, outputs, outputOptions, inputOptions)
