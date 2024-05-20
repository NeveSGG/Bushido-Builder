interface IAttribute {
  name: string
  value: string | number | boolean | Record<string, string> | null | undefined
}

export interface TreeElement {
  name: string
  folderName: string
  attributes: Array<IAttribute>
  children: Array<TreeElement>
}

import tree from './config/tree.json'

export default tree
