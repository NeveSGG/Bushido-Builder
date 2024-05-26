"use client";
import { FC, useEffect, useState } from 'react'
import {
    Alert,
    Box,
    Button,
    Container,
    CssBaseline,
    Divider,
    IconButton,
    Skeleton,
    Snackbar,
    Stack,
    ThemeProvider,
    Typography,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DragHandleIcon from '@mui/icons-material/DragHandle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import theme from '@/theme';

import AddContainerModal from '@/modals/AddContainerModal';
import EditContainerModal from '@/modals/EditContainerModal';
import DeleteContainerModal from '@/modals/DeleteContainerModal';

import axios from 'axios';

import { DragDropContext, Draggable, Droppable, resetServerContext } from 'react-beautiful-dnd'
import { treeSchema } from '@/utils/schemas/treeSchema';
import { z } from 'zod';
import AddElementModal from '@/modals/AddElementModal';

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
    const [treeLoading, setTreeLoading] = useState<boolean>(true);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

    const [addContainerModalOpen, setAddContainerModalOpen] = useState<boolean>(false);
    const [editContainerModalOpen, setEditContainerModalOpen] = useState<boolean>(false);
    const [deleteContainerModalOpen, setDeleteContainerModalOpen] = useState<boolean>(false);

    const [addElementModalOpen, setAddElementModalOpen] = useState<boolean>(false);

    const [containerIndexToEdit, setContainerIndexToEdit] = useState<number | null>(null);
    const [containerIndexToDelete, setContainerIndexToDelete] = useState<number | null>(null);

    const [notificationOpened, setNotificationOpened] = useState<boolean>(false);
    const [notificationMsg, setNotificationMsg] = useState<string>('');
    const [notificationStatus, setNotificationStatus] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    const [tree, setTree] = useState<z.infer<typeof treeSchema> | null>(null);

    useEffect(() => {
        resetServerContext()

        axios.get('/api/read-json-tree')
            .then(response => {
                setTree(treeSchema.parse(response.data))
            })
            .catch(error => {
                console.error(error)

                setNotificationMsg('Произошла ошибка во время загрузки данных. Попробуйте перезагрузить страницу')
                setNotificationStatus('error')
                setNotificationOpened(true)
            })
            .finally(() => {
                setTreeLoading(false)
            })
    }, [])

    useEffect(() => {
        const handleWindowClose = (e: BeforeUnloadEvent) => {
          if (!unsavedChanges) return;

          e.preventDefault();
        };

        window.addEventListener('beforeunload', handleWindowClose);

        return () => {
          window.removeEventListener('beforeunload', handleWindowClose);
        };
    }, [unsavedChanges]);
  
    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
            <DragDropContext
                onDragEnd={(result) => {
                    const { destination, source } = result;

                    if (!destination) return;

                    setTree((oldTree) => {
                        const newItems= Array.from(oldTree!);
                        const [reOrdered] = newItems.splice(source.index-1, 1);
                        newItems.splice(destination.index-1, 0, reOrdered);
                        return (newItems)
                    })
                    setUnsavedChanges(true)
                }}
            >
            <Box sx={{ display: 'flex' }}>
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
                            {
                                treeLoading
                                ? 
                                    ([1, 2, 3].map((item) => (
                                        <Skeleton key={`${item}_skeleton`} variant="rounded" width="100%" height="264px" />
                                    )))
                                :
                                    tree 
                                ?
                                    tree.map((item, index) => {
                                    const {id, attributes, children} = item
                                    const columns = (attributes.find((attr) => attr.name === 'data-container-type')?.value ?? 1) as number

                                    return (
                                        <Draggable key={id} draggableId={`container_${id}`} index={index+1}>
                                            {(draggableProvided) => (
                                                <Box
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    borderRadius: '4px',
                                                    bgcolor: 'background.paper',
                                                    width: '100%',
                                                    minHeight: '50px',
                                                    position: 'relative',
                                                    p: 1,
                                                    pt: 7,
                                                }}
                                                style={{ ...draggableProvided.draggableProps.style }}
                                                >
                                                    {
                                                        Array.from({length: columns}, (columnItem, columnItemIndex) => (
                                                            <Box
                                                            key={`button_${id}_${columnItemIndex}`}
                                                            display="flex"
                                                            sx={{
                                                                width: `calc(100% / ${columns})`
                                                            }}
                                                            >
                                                                <IconButton
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: '200px',
                                                                        borderRadius: '8px'
                                                                    }}
                                                                    onClick={() => setAddElementModalOpen(true)}
                                                                    color="secondary"
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                                {columnItemIndex !== columns-1 ? (
                                                                    <Divider orientation="vertical" variant="middle" flexItem sx={{ borderRightWidth: '2px'}} />
                                                                ) : null}
                                                            </Box>
                                                        ))
                                                    }
                                                    <IconButton
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            left: '5px',
                                                        }}
                                                        color="secondary"
                                                        {...draggableProvided.dragHandleProps}
                                                    >
                                                        <DragHandleIcon />
                                                    </IconButton>
            
                                                    <Stack
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            right: '5px',
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            gap: '10px'
                                                        }}
                                                    >
                                                        <IconButton
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => {
                                                                setContainerIndexToEdit(id)
                                                                setEditContainerModalOpen(true)
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => {
                                                                setContainerIndexToDelete(id)
                                                                setDeleteContainerModalOpen(true)
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Draggable>
                                        )})
                                :
                                    null
                            }
                            {provided.placeholder}
                        </Box>
                        )}
                    </Droppable>
        
                    <Stack display="flex" flexDirection="row" justifyContent="space-between" width="100%" marginTop="20px">
                        <Stack display="flex" flexDirection="column" width="180px" gap="10px">
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setAddContainerModalOpen(true)
                                }}
                                sx={{ justifyContent: 'flex-start' }}
                                size="small"
                                startIcon={<AddIcon />}
                            >
                                Добавить блок
                            </Button>
            
                            <Button
                                variant="outlined"
                                onClick={() => {}}
                                sx={{ justifyContent: 'flex-start' }}
                                size="small"
                                color="success"
                                startIcon={<VisibilityIcon />}
                            >
                                Предпросмотр
                            </Button>
                        </Stack>

                        <Button
                            variant="text"
                            onClick={() => {
                                axios.post('/api/edit-json-tree', tree)
                                    .then(response => {
                                        console.log(response)
                                        setUnsavedChanges(false)

                                        setNotificationMsg('Изменения сохранены')
                                        setNotificationStatus('success')
                                        setNotificationOpened(true)
                                    })
                                    .catch(error => {
                                        console.error(error)

                                        setNotificationMsg('Произошла ошибка во время сохранения данных. Попробуйте ещё раз')
                                        setNotificationStatus('error')
                                        setNotificationOpened(true)
                                    })
                            }}
                            sx={{height: 'min-content'}}
                            disabled={!unsavedChanges}
                        >
                            Сохранить
                        </Button>
                    </Stack>
                </Box>
            </Box>
            </DragDropContext>
        </Container>

        <AddContainerModal
            open={addContainerModalOpen}
            handleClose={() => {setAddContainerModalOpen(false)}}
            options={[
                {
                    key: 1,
                    choiceHandler: () => {
                        setTree((oldTree) => {
                            const newTree = oldTree ?? [];

                            newTree.push({
                                id: Math.floor(100000 + Math.random()*900000),
                                name: 'Container',
                                attributes: [
                                    {
                                        name: 'data-container-type',
                                        value: 1
                                    }
                                ],
                                props: [],
                                children: []
                            })

                            return newTree
                        })
                        setUnsavedChanges(true)
                        setAddContainerModalOpen(false)
                    },
                    label: 'Один',
                    style: {
                        width: '150px',
                        height: '200px',
                        borderRadius: '5px',
                        color: 'grey'
                    }
                },
                {
                    key: 2,
                    choiceHandler: () => {
                        setTree((oldTree) => {
                            const newTree = oldTree ?? [];

                            newTree.push({
                                id: Math.floor(100000 + Math.random()*900000),
                                name: 'Container',
                                attributes: [
                                    {
                                        name: 'data-container-type',
                                        value: 2
                                    }
                                ],
                                props: [],
                                children: []
                            })

                            return newTree
                        })
                        setUnsavedChanges(true)
                        setAddContainerModalOpen(false)
                    },
                    label: 'Два элемента',
                    style: {
                        width: '150px',
                        height: '200px',
                        borderRadius: '5px',
                        color: 'grey'
                    }
                },
                {
                    key: 3,
                    choiceHandler: () => {
                        setTree((oldTree) => {
                            const newTree = oldTree ?? [];

                            newTree.push({
                                id: Math.floor(100000 + Math.random()*900000),
                                name: 'Container',
                                attributes: [
                                    {
                                        name: 'data-container-type',
                                        value: 3
                                    }
                                ],
                                props: [],
                                children: []
                            })

                            return newTree
                        })
                        setUnsavedChanges(true)
                        setAddContainerModalOpen(false)
                    },
                    label: 'Три элемента',
                    style: {
                        width: '150px',
                        height: '200px',
                        borderRadius: '5px',
                        color: 'grey'
                    }
                }
            ]}
        />

        <EditContainerModal
            open={editContainerModalOpen}
            handleClose={() => {
                setEditContainerModalOpen(false)
                setContainerIndexToEdit(null)
            }}
            options={[
                {
                    key: 1,
                    choiceHandler: () => {
                        setTree((oldTree) => {
                            const newTree = Array.from(oldTree!)

                            const itemIndex = newTree.findIndex((treeItem) => treeItem.id === containerIndexToEdit)

                            if (itemIndex !== -1) {
                                newTree[itemIndex].attributes = newTree[itemIndex].attributes.map((attr) => {
                                    if (attr.name !== 'data-container-type') return attr

                                    return {
                                        name: 'data-container-type',
                                        value: 1
                                    }
                                })
                            }

                            return newTree
                        })

                        setUnsavedChanges(true)

                        setEditContainerModalOpen(false)
                        setContainerIndexToEdit(null)
                    },
                    label: 'Один',
                    style: {
                        width: '150px',
                        height: '200px',
                        borderRadius: '5px',
                        color: 'grey'
                    }
                },
                {
                    key: 2,
                    choiceHandler: () => {
                        setTree((oldTree) => {
                            const newTree = Array.from(oldTree!)

                            const itemIndex = newTree.findIndex((treeItem) => treeItem.id === containerIndexToEdit)

                            if (itemIndex !== -1) {
                                newTree[itemIndex].attributes = newTree[itemIndex].attributes.map((attr) => {
                                    if (attr.name !== 'data-container-type') return attr

                                    return {
                                        name: 'data-container-type',
                                        value: 2
                                    }
                                })
                            }

                            return newTree
                        })

                        setUnsavedChanges(true)

                        setEditContainerModalOpen(false)
                        setContainerIndexToEdit(null)
                    },
                    label: 'Два элемента',
                    style: {
                        width: '150px',
                        height: '200px',
                        borderRadius: '5px',
                        color: 'grey'
                    }
                },
                {
                    key: 3,
                    choiceHandler: () => {
                        setTree((oldTree) => {
                            const newTree = Array.from(oldTree!)

                            const itemIndex = newTree.findIndex((treeItem) => treeItem.id === containerIndexToEdit)

                            if (itemIndex !== -1) {
                                newTree[itemIndex].attributes = newTree[itemIndex].attributes.map((attr) => {
                                    if (attr.name !== 'data-container-type') return attr

                                    return {
                                        name: 'data-container-type',
                                        value: 3
                                    }
                                })
                            }

                            return newTree
                        })

                        setUnsavedChanges(true)

                        setEditContainerModalOpen(false)
                        setContainerIndexToEdit(null)
                    },
                    label: 'Три элемента',
                    style: {
                        width: '150px',
                        height: '200px',
                        borderRadius: '5px',
                        color: 'grey'
                    }
                }
            ]}
        />

        <DeleteContainerModal
            open={deleteContainerModalOpen}
            handleClose={() => {
                setDeleteContainerModalOpen(false)
                setContainerIndexToDelete(null)
            }}
            deleteHandle={() => {
                setTree((oldTree) => {
                    const newTree = oldTree ?? [];

                    return newTree.filter((treeItem) => treeItem.id !== containerIndexToDelete)
                })
                setUnsavedChanges(true)
                setContainerIndexToDelete(null)
                setDeleteContainerModalOpen(false)
            }}
        />

        <AddElementModal
            open={addElementModalOpen}
            handleClose={() => {
                setAddElementModalOpen(false)
            }}
            options={[
                {
                    key: 113342,
                    choiceHandler: () => {
                        
                    },
                    label: 'Текст',
                    icon: 'add_circle'
                }
            ]}
        />

        <Snackbar
            open={notificationOpened}
            autoHideDuration={notificationStatus === 'error' ? undefined : 2000}
            onClose={() => setNotificationOpened(false)}
        >
            <Alert
                onClose={() => setNotificationOpened(false)}
                severity={notificationStatus}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {notificationMsg}
            </Alert>
        </Snackbar>
      </ThemeProvider>
    )
  }

export default Builder