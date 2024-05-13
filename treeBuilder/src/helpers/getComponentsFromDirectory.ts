import tree from '../tree'

interface CompiledComponentIdentifier {
  name: string
}

export default function getComponentsFromDirectory(componentsFolder: string) {
  const files: Map<CompiledComponentIdentifier, any> = new Map()

  return new Promise<Map<CompiledComponentIdentifier, any>>(
    (resolve, reject) => {
      import('../../../compiledComponents/helloBlock')
        .then((module) => {
          files.set(tree[0], module.default)

          resolve(files)
        })
        .catch((err) => reject(err))
    }
  )
}
