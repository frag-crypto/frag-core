const rollup = require('rollup')

async function watch (options, outputs, outputOptions, inputOptions) {
    // for (const output of outputs) {
    //     output.dir = path.join(options.outputDir, output.dir)
    // }
    // create a bundle
    // inputOptions.input = generateInputs(tree, Object.assign({}, inputOptions.input))
    const watchOptions = {
        ...inputOptions,
        // output: [outputOptions],
        output: outputs.map(option => {
            return {
                ...outputOptions,
                ...option
            }
        }),
        watch: {
            // chokidar,
            // clearScreen,
            // exclude,
            // include
        }
    }
    const watcher = rollup.watch(watchOptions)

    watcher.on('event', event => {
        // event.code can be one of:
        //   START        — the watcher is (re)starting
        //   BUNDLE_START — building an individual bundle
        //   BUNDLE_END   — finished building a bundle
        //   END          — finished building all bundles
        //   ERROR        — encountered an error while bundling
        //   FATAL        — encountered an unrecoverable error
    })

    // stop watching
    // watcher.close()

    // for (const conf of inlineConfigs) {
    //     await buildInline(conf)
    // }
}

async function writeBundle (bundle, outputOptions) {
    // generate code
    // const { output } = await bundle.generate(outputOptions)
    await bundle.generate(outputOptions)

    // for (const chunkOrAsset of output) {
    //     if (chunkOrAsset.isAsset)  console.log('Asset', chunkOrAsset)
    //     else console.log('Chunk', chunkOrAsset.modules)
    // }
    // or write the bundle to disk
    await bundle.write(outputOptions)
}

async function buildInline (conf) {
    const bundle = await rollup.rollup(conf.inputOptions).catch(err => {
        throw err
    })

    // console.log(bundle.watchFiles) // an array of file names this bundle depends on

    // console.log(bundle, conf.outputOptions)
    await writeBundle(bundle, conf.outputOptions)
    // console.log('bundle written')
}

// build()

module.exports = watch
