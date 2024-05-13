import { FC, ReactNode } from 'react'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'

interface IDnDContextProvider {
  children: ReactNode
  onDragEnd: OnDragEndResponder
}

const DnDContextProvider: FC<IDnDContextProvider> = ({
  children,
  onDragEnd,
}) => {
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
}

export default DnDContextProvider
