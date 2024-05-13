import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { Draggable } from 'react-beautiful-dnd'

export interface IContentContainerProps {
  id: number
  index: number
}

const ContentContainer: FC<IContentContainerProps> = ({ id, index }) => {
  return (
    <Draggable key={id} draggableId={`container_${id}`} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            borderRadius: '4px',
            bgcolor: 'background.paper',
            width: '100%',
            minHeight: '50px',
            p: 1,
          }}
          style={{ ...provided.draggableProps.style }}
        >
          <Typography paragraph>Контейнер {id}</Typography>
        </Box>
      )}
    </Draggable>
  )
}

export default ContentContainer
