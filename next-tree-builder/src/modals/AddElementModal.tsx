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

interface IOption {
  key: number;
  choiceHandler?: (props: Array<z.infer<typeof propSchema>>) => void;
  props: Array<{
    name: string;
    label: string;
    type: "react" | "string" | "image" | "checkbox" | "code" | "enum";
    description?: string;
  }>;
  label: string;
  style?: any;
  icon?: any;
}

interface IProps {
  open: boolean;
  handleClose?: () => void;
  options: Array<IOption>;
}

const steps = ["Тип контента", "Заполнение данными"];

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  pt: 3,
  px: 4,
  pb: 3,
};

export const CustomMuiButtonBase = styled(Button)<ButtonProps>(({ theme }) => ({
  boxShadow: "none",
  display: "flex",
  flexDirection: "column",
  color: theme.palette.text.primary,
  borderColor: "rgba(255, 255, 255, 0.12)",
  backgroundColor: theme.palette.background.default,
  textTransform: "unset",
  lineHeight: "19px",
  padding: "10px 10px 10px 10px",
  width: "90px",
  gap: "10px",
  height: "120px",
  [`& .${buttonClasses.startIcon}`]: {
    marginLeft: "unset",
    marginRight: "unset",
  },
  [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
    fontSize: "30px",
  },
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
}));

const AddElementModal: FC<IProps> = ({ open, handleClose, options }) => {
  useEffect(() => {
    setActiveStep(0);
    setSelectedElementKey(null);

    if (!open) {
      setFilledData(new Map());
    } else {
      setFilledData(
        options.reduce((prev, curr) => {
          prev.set(
            curr.key,
            curr.props.map((currProp) => ({ ...currProp, value: null }))
          );

          return prev;
        }, new Map<number, Array<z.infer<typeof propSchema>>>())
      );
    }
  }, [open, options]);

  const [activeStep, setActiveStep] = useState(0);
  const [selectedElementKey, setSelectedElementKey] = useState<number | null>(
    null
  );
  const [filledData, setFilledData] = useState<
    Map<number, Array<z.infer<typeof propSchema>>>
  >(new Map());

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedElementKey(null);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ ...style, width: 1200 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};

            if (index === 0) {
              if (typeof selectedElementKey === "number") {
                stepProps.completed = true;
              } else {
                stepProps.completed = false;
              }
            }

            return (
              <Step key={label} {...stepProps}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <>
            <Typography sx={{ mb: 1 }}>
              Всё заполнено. Кликай &quot;Добавить&quot;!
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                pt: 2,
              }}
            >
              <Stack display="flex" gap="20px" flexDirection="row">
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Назад
                </Button>
                <Button onClick={handleReset} color="error">
                  Сбросить
                </Button>
              </Stack>

              <Button
                onClick={() => {
                  const option = options.find(
                    (opt) => opt.key === selectedElementKey
                  );

                  if (option && option.choiceHandler) {
                    option.choiceHandler(filledData.get(selectedElementKey!)!);

                    if (handleClose) {
                      handleClose();
                    }
                  }
                }}
              >
                Добавить
              </Button>
            </Box>
          </>
        ) : (
          <>
            {activeStep === 0 ? (
              <Box>
                {options.map((option) => (
                  <CustomMuiButtonBase
                    key={option.key}
                    variant="outlined"
                    disableRipple
                    startIcon={<Icon>{option.icon ?? "add_circle"}</Icon>}
                    color="success"
                    sx={{
                      ...option.style,
                      borderColor:
                        selectedElementKey === option.key
                          ? "rgba(255, 255, 255, 0.8)"
                          : "rgba(255, 255, 255, 0.12)",
                    }}
                    onClick={() => {
                      setSelectedElementKey(option.key);
                      handleNext();
                    }}
                  >
                    {option.label}
                  </CustomMuiButtonBase>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {filledData.get(selectedElementKey!)?.map((prop, ind, arr) => (
                  <Box
                    key={`prop-${selectedElementKey}-${ind}`}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "30px",
                    }}
                  >
                    <Typography>{prop.label}</Typography>

                    {prop.type === "enum" ? (
                      <Select
                        value={
                          prop.value ??
                          JSON.parse(prop.description ?? "[]")[0].value
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
                            const newMap = new Map(oldFilledData);
                            const newPropsArr = Array.from(arr);
                            newPropsArr[ind].value = newValEvent.target.value;

                            newMap.set(selectedElementKey!, newPropsArr);
                            return newMap;
                          });
                        }}
                      >
                        {JSON.parse(prop.description ?? "[]").map(
                          (valueItem: any) => (
                            <MenuItem
                              key={`prop-value-${selectedElementKey}-${ind}-${valueItem.label}`}
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
                            const newMap = new Map(oldFilledData);
                            const newPropsArr = Array.from(arr);
                            newPropsArr[ind].value = newValEvent.target.value;

                            newMap.set(selectedElementKey!, newPropsArr);
                            return newMap;
                          });
                        }}
                      />
                    ) : null}
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {activeStep !== 0 && (
                <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                  Назад
                </Button>
              )}

              <Box sx={{ flex: "1 1 auto" }} />

              {activeStep === 0 ? (
                typeof selectedElementKey === "number" ? (
                  <Button onClick={handleNext}>Далее</Button>
                ) : null
              ) : (
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Завершить" : "Далее"}
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AddElementModal;
