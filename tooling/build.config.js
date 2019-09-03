const resolve = require('rollup-plugin-node-resolve')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')

const sass = require('rollup-plugin-sass')
const autoprefixer = require('autoprefixer')
// import postcss from 'rollup-plugin-postcss'
const postcss = require('postcss')

// import minifyHTML from 'rollup-plugin-minify-html-literals'
const terser = require('rollup-plugin-terser').terser

const tree = require('../src/build-tree.js')

const sassOptions = {
    output: 'build/styles.bundle.css',
    processor: css => postcss([autoprefixer])
        .process(css)
        .then(result => result.css)
}

const inputOptions = {
    // core input options
    // external,
    input: {
        // Populated from the tree
    },
    plugins: [
        resolve({
            module: true
        }),
        commonjs({}),
        globals(),
        sass(sassOptions),
        builtins()
    ],
    manualChunks: {
        // 'lit-element': ['lit-element']
    }
}

const outputs = [
    {
        dir: 'build/es6',
        format: 'esm'
    },
    {
        dir: 'build/system',
        format: 'system' // required
    }
]

// Original
const outputOptions = {
    // General output options. Added to from outputs
    // dir: 'build/system',
    // format: 'system' // required
}

function generateInputs (tree, inputs = {}) {
    // console.log(tree)
    // console.log(Object.values(tree))
    for (const file of Object.values(tree)) {
        // const fileName =
        // console.log(file)
        // inputs[file.file.split('.')[0]] = 'src/' + file.source
        inputs[file.file.split('.')[0]] = file.source
        if (file.children) generateInputs(file.children, inputs)
    }
    return inputs
}

inputOptions.input = generateInputs(tree.componentTree, inputOptions.input)
// inputOptions.input = generateInputs(tree.functionalComponents, inputOptions.input)
// inputOptions.input = generateInputs(tree.apiComponents, inputOptions.input)

module.exports = {
    outputs,
    outputOptions,
    inputOptions
}
