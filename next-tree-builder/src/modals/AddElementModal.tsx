import { FC, useState } from 'react';
import Icon from '@mui/material/Icon'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button, { ButtonProps, buttonClasses } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography';
import { Modal } from '@mui/material';

interface IOption {
    key: number,
    choiceHandler?: () => void,
    label: string,
    style?: any,
    icon?: any
}

interface IProps {
    open: boolean,
    handleClose?: () => void,
    options: Array<IOption>
}

const steps = ['Тип контента', 'Заполнение данными'];

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    pt: 3,
    px: 4,
    pb: 3,
};

const CustomMuiButtonBase = styled(Button)<ButtonProps>(({ theme }) => ({
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.primary,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: theme.palette.background.default,
    textTransform: 'unset',
    lineHeight: '19px',
    padding: '10px 10px 10px 10px',
    width: '90px',
    gap: '10px',
    height: '120px',
    [`& .${buttonClasses.startIcon}`]: {
      marginLeft: 'unset',
      marginRight: 'unset',
    },
    [`& .${buttonClasses.startIcon} > *:nth-of-type(1)`]: {
      fontSize: '30px',
    },
    '&:hover': {
      color: theme.palette.text.primary,
      boxShadow: 'none',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      backgroundColor: theme.palette.background.paper,
    },
    '&:active': {
      color: theme.palette.text.primary,
      boxShadow: 'none',
      borderColor: 'rgba(255, 255, 255, 0.8)',
      backgroundColor: theme.palette.background.paper,
    },
  }))

const AddElementModal: FC<IProps> = ({open, handleClose, options}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedElementKey, setSelectedElementKey] = useState<number | null>(null)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0)
    setSelectedElementKey(null)
  };

  return (
    <Modal
        open={open}
        onClose={handleClose}
    >
        <Box sx={{ ...style, width: 1200 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {}

                    if (index === 0) {
                        if (typeof selectedElementKey === 'number') {
                            stepProps.completed = true
                        } else {
                            stepProps.completed = false
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
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Всё заполнено. Кликай &quot;Добавить&quot;!
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pt: 2 }}>
                        <Button onClick={handleReset} color="error">Сбросить</Button>

                        <Button onClick={handleClose}>Добавить</Button>
                    </Box>
                </>
            ) : (
                <>
                    {activeStep === 0
                        ?
                            <Box>
                                {options.map((option) => (
                                    <CustomMuiButtonBase
                                        key={option.key}
                                        variant="outlined"
                                        disableRipple
                                        startIcon={<Icon>{option.icon ?? 'add_circle'}</Icon>}
                                        color="success"
                                        sx={{
                                            ...option.style,
                                            borderColor: selectedElementKey === option.key ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.12)'
                                        }}
                                        onClick={() => {
                                            setSelectedElementKey(option.key)
                                            handleNext()
                                        }}
                                    >
                                        {option.label}
                                    </CustomMuiButtonBase>
                                ))}
                                
                            </Box>
                        :
                            <Typography paragraph>Заполнение данными</Typography>
                    }

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Назад
                        </Button>

                        <Box sx={{ flex: '1 1 auto' }} />

                        {activeStep === 0
                            ?
                            (
                                typeof selectedElementKey === 'number'
                                ?
                                <Button onClick={handleNext}>
                                    Далее
                                </Button>
                                :
                                null
                            )
                            :
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Завершить' : 'Далее'}
                        </Button>
                        }
                        
                    </Box>
                </>
            )}
        </Box>
    </Modal>
  );
}

export default AddElementModal