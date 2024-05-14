import React, { ReactElement, ReactNode, cloneElement } from 'react'
import { roots } from '../../roots'

import { render as builderRender } from '../Builder/Builder'
import getComponentsFromDirectory, {
  ElementsMap,
} from '../../helpers/getComponentsFromDirectory'
import tree, { TreeElement } from '../../tree'

let jsxElementsToRender: Array<ReactNode | undefined> = []

function resolveElement(
  compiledComponents: ElementsMap,
  treeItem: TreeElement
): ReactElement | undefined {
  const { name, folderName } = treeItem
  const defaultFunc = compiledComponents.get(`${name}-${folderName}`)

  if (!defaultFunc) return undefined

  const attributes = treeItem.attributes.reduce((acc, attr) => {
    acc[attr.name] = attr.value

    return acc
  }, {} as any)

  const children = treeItem.children.reduce(
    (acc, child) => {
      acc.push(resolveElement(compiledComponents, child))

      return acc
    },
    [] as Array<ReactElement | undefined>
  )

  return cloneElement(defaultFunc(React), attributes, ...children)
}

async function buildJsxForPreview(): Promise<void> {
  jsxElementsToRender = []

  try {
    const compiledComponents =
      await getComponentsFromDirectory('compiledComponents')

    tree.forEach((jsonItem) => {
      const element = resolveElement(compiledComponents, jsonItem)

      if (element) {
        jsxElementsToRender.push(element)
      } else {
        console.error('module not imported by identifier ', jsonItem)
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const returnToBuilderJsx = (
  <div
    style={{
      width: '230px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}
  >
    <button onClick={render}>Обновить</button>
    <button onClick={() => builderRender()}>Вернуться к редактированию</button>
  </div>
)

export async function render() {
  try {
    roots.builderRoot.unmount()
  } catch (e: any) {
    alert('Ошибка при попытки builder unmount: ' + e?.message)
  }

  try {
    await buildJsxForPreview()
    roots.previewRoot.render(
      <>
        {jsxElementsToRender}
        {returnToBuilderJsx}
      </>
    )
  } catch (e: any) {
    alert('Ошибка при попытки рендера предпросмотра: ' + e?.message)
  }
}
