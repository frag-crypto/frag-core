/*
Generates config for rollup from the build tree and it's options
*/
const progress = require('rollup-plugin-progress')

const resolve = require('rollup-plugin-node-resolve')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const alias = require('rollup-plugin-alias')

const scss = require('rollup-plugin-scss')

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

const generateBuildConfig = ({ elementComponents, functionalComponents, apiComponents, aliases, options }) => {
    const buildConfig = {
        outputs: [
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

        },
        inputOptions: {
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

            context: 'window',

            manualChunks: {
                // 'lit-element': ['lit-element']
            }
        },
        options: {
            outputDir: options.outputDir
        }
    }

    console.log(buildConfig.inputOptions.plugins)
    return buildConfig
}

module.exports = generateBuildConfig
