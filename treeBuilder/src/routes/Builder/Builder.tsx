import { FC, useState } from 'react'
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ContentItemButton from '../../components/ContentItemButton'
import DnDContextProvider from '../../components/DnDContextProvider/DnDContextProvider'
import Sidebar from '../../components/Sidebar'
import ContentContainer from '../../components/ContentContainer'
import { Droppable } from 'react-beautiful-dnd'
import { roots } from '../../roots'
import { render as previewRender } from '../Preview/Preview'
import theme from '../../theme'

const sidebarWidth = '440px'

interface IContentContainer {
  id: number
}

function reorder<T>(
  list: Array<T>,
  startIndex: number,
  endIndex: number
): Array<T> {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const Builder: FC = () => {
  const [containers, setContainers] = useState<Array<IContentContainer>>([])

  return (
    <Container>
      <DnDContextProvider
        onDragEnd={(result) => {
          setContainers((oldCntrs) => {
            if (!result.destination) {
              return oldCntrs
            }

            return reorder(
              oldCntrs,
              result.source.index,
              result.destination.index
            )
          })
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Sidebar
            sx={{
              width: sidebarWidth,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: sidebarWidth,
                gap: 2,
                p: 2,
                flexWrap: 'wrap',
              }}
            >
              <ContentItemButton />
              <ContentItemButton />
              <ContentItemButton />
              <ContentItemButton />
              <ContentItemButton />
              <ContentItemButton />
              <ContentItemButton />
              <ContentItemButton />
            </Box>
          </Sidebar>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 2,
            }}
          >
            <Droppable droppableId="containersDroppable">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  {containers.map((item, index) => (
                    <ContentContainer
                      id={item.id}
                      key={item.id}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>

            <Stack display="flex" flexDirection="column" width="210px">
              <Button
                variant="outlined"
                onClick={() => {
                  setContainers((oldContainersState) => [
                    ...oldContainersState,
                    { id: oldContainersState.length + 1 },
                  ])
                }}
                sx={{ mt: 2, justifyContent: 'flex-start' }}
                size="small"
                startIcon={<AddIcon />}
              >
                Добавить блок
              </Button>

              {/* <Button
                variant="outlined"
                onClick={() => {
                  
                }}
                sx={{
                  mt: 2,
                  justifyContent: 'flex-start',
                }}
                color="error"
                size="small"
                startIcon={<CloseIcon />}
              >
                Закрыть построитель
              </Button> */}

              <Button
                variant="outlined"
                onClick={() => previewRender()}
                sx={{ mt: 2, justifyContent: 'flex-start' }}
                size="small"
                color="success"
                startIcon={<VisibilityIcon />}
              >
                Предпросмотр
              </Button>
            </Stack>
          </Box>
        </Box>
      </DnDContextProvider>
    </Container>
  )
}

export const render = (jsx = <Builder />) => {
  try {
    roots.previewRoot.unmount()
  } catch (e: any) {
    alert('Ошибка при попытки unmount превью: ' + e?.message)
  }

  try {
    roots.builderRoot.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {jsx}
      </ThemeProvider>
    )
  } catch (e: any) {
    alert('Ошибка при попытки рендера builder-а: ' + e?.message)
  }
}
