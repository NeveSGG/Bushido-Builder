import theme from "@/theme";
import { Box, Divider, Icon, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { FC } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface IProps {
  columnItem: any;
  columnItemIndex: number;
  columns: number;
  id: number;
  setAddElementModalOpen(param: any): any;
  setContainerIndexToEditElement(param: any): any;
  setElementIndexToAdd(param: any): any;
}

const Element: FC<IProps> = ({
  columnItem,
  columnItemIndex,
  columns,
  id,
  setAddElementModalOpen,
  setContainerIndexToEditElement,
  setElementIndexToAdd,
}) => {
  return (
    <Droppable
      droppableId={`container_${id}_droppable_id`}
      key={`item_${columnItem.id}`}
      type="droppable-element"
    >
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
              draggableId={`container_${id}_draggable_id`}
              index={columnItemIndex}
            >
              {(draggableProvider) => (
                <Box
                  sx={{
                    boxShadow: "none",
                    display: "flex",
                    flexDirection: "column",
                    color: theme.palette.text.primary,
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    backgroundColor: theme.palette.background.default,
                    textTransform: "unset",
                    lineHeight: "19px",
                    padding: "10px 10px 10px 10px",
                    gap: "10px",
                    "&:hover": {
                      color: theme.palette.text.primary,
                      boxShadow: "none",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                      backgroundColor: theme.palette.background.paper,
                    },
                    "&:active": {
                      color: theme.palette.text.primary,
                      boxShadow: "none",
                      borderColor: "rgba(255, 255, 255, 0.8)",
                      backgroundColor: theme.palette.background.paper,
                    },
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
                  <Icon>add_circle</Icon>
                  Текстовый блок
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
