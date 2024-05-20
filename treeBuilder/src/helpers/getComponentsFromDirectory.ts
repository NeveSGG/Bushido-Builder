import React, { ReactElement } from 'react'
import tree from '../tree'

interface ImportedCompiledComponent {
  default(param: typeof React): ReactElement
}

export type ElementsMap = Map<string, (param: typeof React) => ReactElement>

export default async function getComponentsFromDirectory(
  componentsFolder: string
): Promise<ElementsMap> {
  return new Promise((resolve, reject) => {
    const files: ElementsMap = new Map()

    Promise.all(
      tree.map((treeElement) => {
        return import(
          /* @vite-ignore */
          `/${componentsFolder}/${treeElement.folderName}/index.js`
        )
          .then((module: ImportedCompiledComponent) => {
            const { name, folderName } = treeElement
            files.set(`${name}-${folderName}`, module.default)
          })
          .catch((err) => {
            console.error(err)
          })
      })
    )
      .then(() => {
        resolve(files)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
