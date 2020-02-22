'use strict'
import { Epml, EpmlStream } from '../epml.js'
// import { ContentWindow } from 'epml'

// Epml.registerPlugin(ContentWindow)

window.Epml = Epml
window.EpmlStream = EpmlStream

const pluginScript = document.createElement('script')
pluginScript.async = false
pluginScript.type = 'module'
const hash = window.location.hash
console.log(hash)
pluginScript.src = '/plugin/' + hash.slice(1)
// pluginScript.src = window.location.protocol + '//' + hash.slice(1) + '.' + window.location.hostname + '/main.js'
// pluginScript.src = '/main.js'
console.log(pluginScript.src)
document.body.appendChild(pluginScript)
