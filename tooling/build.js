const rollup = require('rollup')

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

async function build (options, outputs, outputOptions, inputOptions, inlineConfigs) {
    // for (const output of outputs) {
    //     output.dir = path.join(options.outputDir, output.dir)
    // }
    // create a bundle
    // inputOptions.input = generateInputs(tree, Object.assign({}, inputOptions.input))
    const bundle = await rollup.rollup(inputOptions).catch(err => {
        throw err
    })

    // console.log(bundle.watchFiles) // an array of file names this bundle depends on

    for (const option of outputs) {
        await writeBundle(bundle, {
            ...outputOptions,
            ...option
        })
    }

    for (const conf of inlineConfigs) {
        await buildInline(conf)
    }
}

// build()

module.exports = build
