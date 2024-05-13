import { createRoot, Root } from 'react-dom/client'

export type RootCustom = Root & { _internalRoot?: unknown }

const BUILDER_CONTAINER_ID = 'builder'
const PREVIEW_CONTAINER_ID = 'preview'

export class Roots {
  private static instance: Roots

  static builderNode: HTMLElement | null
  static previewNode: HTMLElement | null

  private static _builderRoot: RootCustom | null
  private static _previewRoot: RootCustom | null

  private constructor() {
    Roots.builderNode = document.getElementById(BUILDER_CONTAINER_ID)
    Roots.previewNode = document.getElementById(PREVIEW_CONTAINER_ID)
  }

  static getInstance() {
    if (!Roots.instance) {
      Roots.instance = new Roots()
    }

    return Roots.instance
  }

  get builderRoot(): RootCustom {
    if (!Roots._builderRoot || !Roots._builderRoot._internalRoot) {
      Roots._builderRoot = createRoot(Roots.builderNode!)
    }

    return Roots._builderRoot
  }

  set builderRoot(newValue: RootCustom) {
    Roots._builderRoot = newValue
  }

  get previewRoot(): RootCustom {
    if (!Roots._previewRoot || !Roots._previewRoot._internalRoot) {
      Roots._previewRoot = createRoot(Roots.previewNode!)
    }

    return Roots._previewRoot
  }

  set previewRoot(newValue: RootCustom) {
    Roots._previewRoot = newValue
  }
}

export const roots = Roots.getInstance()
