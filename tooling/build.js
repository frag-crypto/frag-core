const rollup = require('rollup')
const path = require('path')

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

async function build (options, outputs, outputOptions, inputOptions) {

    for (const output of outputs) {
        output.dir = path.join(options.outputDir, output.dir)
    }
    // create a bundle
    // inputOptions.input = generateInputs(tree, Object.assign({}, inputOptions.input))
    console.log(inputOptions.input)
    console.log(__dirname)
    const bundle = await rollup.rollup(inputOptions).catch(err => {
        throw err
    })

    console.log(bundle.watchFiles) // an array of file names this bundle depends on

    for (const option of outputs) {
        await writeBundle(bundle, {
            ...outputOptions,
            ...option
        })
    }
}

// build()

module.exports = build
