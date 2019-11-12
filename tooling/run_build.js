// Just testing

const {
    // inputs,
    outputs,
    outputOptions,
    inputOptions,
    options
} = require('./build.config.js')

const build = require('./build.js')

build(options, outputs, outputOptions, inputOptions)
