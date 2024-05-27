import { FC, useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button, { ButtonProps, buttonClasses } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { MenuItem, Modal, Select, Stack, TextField } from "@mui/material";
import { z } from "zod";
import { propSchema } from "@/utils/schemas/treeSchema";

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleSave(param: Array<z.infer<typeof propSchema>>): void;
  props: Array<z.infer<typeof propSchema>>;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  pt: 3,
  px: 4,
  pb: 3,
};

const EditElementModal: FC<IProps> = ({
  open,
  handleClose,
  handleSave,
  props,
}) => {
  const [filledData, setFilledData] =
    useState<Array<z.infer<typeof propSchema>>>(props);

  useEffect(() => {
    if (!open) {
      setFilledData([]);
    } else {
      setFilledData(props);
    }
  }, [open, props]);

  const handleReset = () => {
    setFilledData(props);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...style, width: 800 }}>
        <h2>Редактирования элемента контента</h2>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {filledData.map((prop, ind) => (
            <Box
              key={`prop-${ind}`}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <Typography>{prop.name}</Typography>

              {prop.type === "enum" ? (
                <Select
                  value={
                    prop.value ?? JSON.parse(prop.description ?? "[]")[0].value
                  }
                  size="small"
                  fullWidth
                  sx={{
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                    "& svg": {
                      color: "rgba(255,255,255,0.6)",
                    },
                  }}
                  onChange={(newValEvent) => {
                    setFilledData((oldFilledData) => {
                      const newPropsArr = Array.from(oldFilledData);
                      newPropsArr[ind].value = newValEvent.target.value;

                      return newPropsArr;
                    });
                  }}
                >
                  {JSON.parse(prop.description ?? "[]").map(
                    (valueItem: any) => (
                      <MenuItem
                        key={`prop-value-${ind}-${valueItem.label}`}
                        value={valueItem.value}
                      >
                        {valueItem.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              ) : prop.type === "string" ? (
                <TextField
                  value={prop.value ?? ""}
                  size="small"
                  fullWidth
                  sx={{
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                  }}
                  onChange={(newValEvent) => {
                    setFilledData((oldFilledData) => {
                      const newPropsArr = Array.from(oldFilledData);
                      newPropsArr[ind].value = newValEvent.target.value;

                      return newPropsArr;
                    });
                  }}
                />
              ) : null}
            </Box>
          ))}
        </Box>

        <Stack
          display="flex"
          gap="20px"
          flexDirection="row"
          justifyContent="space-between"
          marginTop="20px"
        >
          <Button onClick={handleReset} color="error">
            Отменить все изменения
          </Button>

          <Button
            color="success"
            onClick={() => {
              handleSave(filledData);
              handleClose();
            }}
          >
            Сохранить
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditElementModal;
