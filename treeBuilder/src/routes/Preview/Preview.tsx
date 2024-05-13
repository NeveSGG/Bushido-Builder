import React, { ReactNode, createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { roots } from '../../roots'

import { render as builderRender } from '../Builder/Builder'
import getComponentsFromDirectory from '../../helpers/getComponentsFromDirectory'
import tree from '../../tree'

const returnToBuilderJsx = (
  <button onClick={() => builderRender()}>Вернуться к редактированию</button>
)

let jsxToRender = <p style={{ color: 'red' }}>NOTHING TO SHOW</p>

const compiledComponents = await getComponentsFromDirectory('')

tree.forEach((jsonItem) => {
  const component = compiledComponents.get(jsonItem)

  jsxToRender = component(React)
})

export const render = (jsx = jsxToRender) => {
  try {
    roots.builderRoot.unmount()
  } catch (e: any) {
    alert('Ошибка при попытки builder unmount: ' + e?.message)
  }

  console.log(renderToString(jsx))

  try {
    roots.previewRoot.render(
      <>
        {jsx}
        {returnToBuilderJsx}
      </>
    )
  } catch (e: any) {
    alert('Ошибка при попытки рендера предпросмотра: ' + e?.message)
  }
}
