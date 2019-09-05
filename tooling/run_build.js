const {
    // inputs,
    outputs,
    outputOptions,
    inputOptions
} = require('./build.config.js')

const build = require('./build.js')

build(outputs, outputOptions, inputOptions)
