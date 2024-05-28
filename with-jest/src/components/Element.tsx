import theme from "@/theme";
import { Box, Divider, Icon, IconButton, Stack } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

import AddIcon from "@mui/icons-material/Add";
import { FC, MouseEvent } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { treeElementSchema } from "@/utils/schemas/treeSchema";
import { z } from "zod";

interface IProps {
  columnItem: z.infer<typeof treeElementSchema>;
  columnItemIndex: number;
  columns: number;
  id: number;
  setAddElementModalOpen(param: any): any;
  setContainerIndexToEditElement(param: any): any;
  setElementIndexToAdd(param: any): any;

  onEditClick(param: MouseEvent): any;
  onDeleteClick(param: MouseEvent): any;
}

const Element: FC<IProps> = ({
  columnItem,
  columnItemIndex,
  columns,
  id,
  setAddElementModalOpen,
  setContainerIndexToEditElement,
  setElementIndexToAdd,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Droppable droppableId={columnItem.id.toString()} type="element-droppable">
      {(containerDroppableProvider) => (
        <Box
          display="flex"
          sx={{
            width: `calc(100% / ${columns})`,
          }}
          {...containerDroppableProvider.droppableProps}
          ref={containerDroppableProvider.innerRef}
        >
          {columnItem.name !== "Void" ? (
            <Draggable
              draggableId={columnItem.id.toString()}
              index={columnItemIndex}
            >
              {(draggableProvider, draggableSnapshot) => (
                <Box
                  sx={{
                    position: "relative",
                    boxShadow: "none",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    color: theme.palette.text.primary,
                    textTransform: "unset",
                    lineHeight: "19px",
                    padding: "10px 10px 10px 10px",
                    gap: "10px",
                    borderColor: draggableSnapshot.isDragging
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(255, 255, 255, 0.12)",
                    backgroundColor: draggableSnapshot.isDragging
                      ? "rgba(255, 255, 255, 0.5)"
                      : theme.palette.background.default,
                    width: "100%",
                    height: "200px",
                    borderRadius: "8px",
                  }}
                  ref={draggableProvider.innerRef}
                  {...draggableProvider.draggableProps}
                  {...draggableProvider.dragHandleProps}
                  style={{
                    ...draggableProvider.draggableProps.style,
                  }}
                >
                  {columnItem.name}
                  <Stack
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      display: "flex",
                      flexDirection: "row",
                      gap: "10px",
                    }}
                  >
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={onEditClick}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={onDeleteClick}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Stack>
                </Box>
              )}
            </Draggable>
          ) : (
            <IconButton
              sx={{
                width: "100%",
                height: "200px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setAddElementModalOpen(true);
                setContainerIndexToEditElement(id);
                setElementIndexToAdd(columnItem.id);
              }}
              color="secondary"
            >
              <AddIcon />
            </IconButton>
          )}

          {columnItemIndex !== columns - 1 ? (
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                borderRightWidth: "2px",
              }}
            />
          ) : null}
          {containerDroppableProvider.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default Element;
