export interface TreeElement {
  name: string
  description: string
  children: Array<TreeElement>
}

import tree from './config/tree.json'

export default tree
