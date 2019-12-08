// This isn't used... was an idea for building lazy loading elements...but seeing as we are building through frag.build now, I don't see much need for it.
// Lazy loading can still be accomplished...but shouldn't need this class

import { LitElement, html } from 'lit-element'

const modulesLoading = []

class FragLitElement extends LitElement {
    onLoaded (buildDir, children) {
        for (const child in children) {
            childInfo = children[child]
            modulesLoading.push(
                import(buildDir + child.file).then(module => {
                    if (module.children) {
                        module.onLoaded(buildDir, child.children)
                    } else {
                        return ''
                    }
                })
            )
        }
    }
}

export * from 'lit-element'
export { FragLitElement }
