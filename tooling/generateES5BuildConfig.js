const babel = require('rollup-plugin-babel')
// const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
// const uglify = require('rollup-plugin-uglify').uglify
const commonjs = require('rollup-plugin-commonjs')
const progress = require('rollup-plugin-progress')
const path = require('path')
const alias = require('rollup-plugin-alias')

const generateRollupConfig = (file, { outputDir, aliases }) => {
    return {
        inputOptions: {
            input: file.input,
            onwarn: (warning, rollupWarn) => {
                if (warning.code !== 'CIRCULAR_DEPENDENCY') {
                    rollupWarn(warning)
                }
            },
            plugins: [
                resolve({
                    // jsnext: true,
                    preferBuiltins: true// ,
                    // dedupe: ['lit-element']
                }),
                alias({
                    entries: Object.keys(aliases).map(find => {
                        return {
                            find,
                            replacement: aliases[find]
                        }
                    })
                }),
                commonjs(),
                // eslint(),
                progress(),
                babel({
                    exclude: 'node_modules/**'
                })
                // uglify() // only would work if babel is transpiling to es5
            ],
            external: ['crypto']// ,
            // preserveSymlinks: true
        },
        outputOptions: {
            // name: 'main', // for external calls (need exports)
            // file: 'dist/js/index.min.js',
            file: path.join(outputDir, file.output),
            format: 'umd', // was umd
            // plugins: pluginOptions,
            name: 'worker',
            sourcemap: true
        }
    }
}

const generateES5BuildConfig = (files, options) => {
    return files.map(file => generateRollupConfig(file, options))
}

// const thing = [{
//     input: './src/js/index.es6',
//     output: {
//         name: 'main', // for external calls (need exports)
//         file: 'dist/js/index.min.js',
//         format: 'iife' // umd
//     },
//     plugins: pluginOptions
// },
// {
//     // ... // for multi entrypoints
// }]

module.exports = generateES5BuildConfig
