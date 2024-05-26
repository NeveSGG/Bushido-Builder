import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';


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

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const EditContainerModal: FC<IProps> = ({open, handleClose, options}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            keepMounted
        >
            <Box sx={{ ...style, width: 600 }}>
                <h2>Измените тип блока</h2>

                <Box
                    sx={{
                        width: '100%',
                        overflow: 'auto'
                    }}
                >
                    <Stack
                        display="flex"
                        flexDirection="row"
                        overflow="auto"
                        gap="15px"
                    >
                        {options.map((option) => (
                            <IconButton
                                sx={option.style}
                                key={option.key}
                                onClick={option.choiceHandler}
                            >
                                <Typography paragraph>{option.label}</Typography>
                                {option.icon}
                            </IconButton>
                        ))}
                    </Stack>
                </Box>

                <Button variant="text" onClick={handleClose}>
                    Отмена
                </Button>
            </Box>
        </Modal>
    )
    
}

export default EditContainerModal