// Default build config

const resolve = require('rollup-plugin-node-resolve')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const alias = require('rollup-plugin-alias')

const sass = require('rollup-plugin-sass')
const autoprefixer = require('autoprefixer')
// import postcss from 'rollup-plugin-postcss'
const postcss = require('postcss')

// import minifyHTML from 'rollup-plugin-minify-html-literals'
// const terser = require('rollup-plugin-terser').terser

// This is where we can doooo stufff
const tree = require('../src/build-tree.js')

// ?? Not sure this should be here...Prefixing build dir does need to happen...but rather to be relative to the project that depends on this
const options = {
    outputDir: 'build'
}

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
        main: 'src/main.js'
        // Populated from the tree
    },
    plugins: [
        alias({
            entries: Object.keys(tree.aliases).map(find => {
                return {
                    find,
                    replacement: tree.aliases[find]
                }
            })
        }),
        resolve({
            // module: true
        }),
        commonjs({}),
        globals(),
        builtins(),
        sass(sassOptions)
    ],

    context: 'window',

    manualChunks: {
        // 'lit-element': ['lit-element']
    }
}

const outputs = [
    {
        // dir: 'build/es6',
        dir: 'es6',
        format: 'esm'
    },
    {
        // dir: 'build/system',
        dir: 'system',
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
    inputOptions,
    options
}
