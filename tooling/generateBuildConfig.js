/*
Generates config for rollup from the build tree and it's options
*/
const progress = require('rollup-plugin-progress')

const path = require('path')

const resolve = require('rollup-plugin-node-resolve')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const alias = require('rollup-plugin-alias')

const scss = require('rollup-plugin-scss')

const generateES5BuildConfig = require('./generateES5BuildConfig')

// const sass = require('rollup-plugin-sass')
// const autoprefixer = require('autoprefixer')
// // import postcss from 'rollup-plugin-postcss'
// const postcss = require('postcss')

const generateInputs = (tree, inputs = {}) => {
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

// Change to something like, (buildTree, buildOptions)
// Where biuldTree has { inlineComponents, elementComponents, functionalComponents, apiComponents, otherOutputs } not sure about otherOutputs...
// And buildOptions has { aliases, options }
const generateBuildConfig = ({ elementComponents, functionalComponents, otherOutputs, apiComponents, aliases, options, inlineComponents }) => {
    const buildConfig = {
        outputs: [
            // ...otherOutputs,
            // {
            //     dir: 'es5',
            //     format: 'iife'
            // },
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
        ],
        outputOptions: {
            sourcemap: true
        },
        inputOptions: {
            onwarn: (warning, rollupWarn) => {
                if (warning.code !== 'CIRCULAR_DEPENDENCY') {
                    rollupWarn(warning)
                }
            },
            // core input options
            // external,
            input: {
                main: options.inputFile,
                ...generateInputs(elementComponents)
                // ...generateInputs(apiComponents)
                // ...generateInputs(functionalComponents)
                // Populated from the tree
            },
            // input: generateInputs(elementComponents, {
            //     main: options.inputFile
            // }),
            plugins: [
                alias({
                    entries: Object.keys(aliases).map(find => {
                        return {
                            find,
                            replacement: aliases[find]
                        }
                    })
                }),
                resolve({
                    // module: true
                    preferBuiltins: true// ,
                    // dedupe: ['lit-element']
                }),
                commonjs({}),
                globals(),
                builtins(),
                progress({
                    // clearLine: false // default: true
                }),
                // sass({
                //     output: options.sassOutputDir,
                //     // output: true,
                //     processor: css => postcss([autoprefixer])
                //         .process(css)
                //         .then(result => result.css)
                // })
                scss({
                    output: options.sassOutputDir
                })
            ],
            external: ['crypto'],

            context: 'window',

            manualChunks: {
                // 'lit-element': ['lit-element']
            }// ,
            // preserveSymlinks: true
        },
        options: {
            outputDir: options.outputDir
        }
    }

    for (const output of buildConfig.outputs) {
        output.dir = path.join(options.outputDir, output.dir)
    }

    const inlineConfigs = generateES5BuildConfig(inlineComponents, {
        outputDir: options.outputDir,
        aliases
    })

    return {
        buildConfig,
        inlineConfigs
    }
}

module.exports = generateBuildConfig
