import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { FC } from 'react';
import { IconButton, Stack, Typography } from '@mui/material';

interface IProps {
    open: boolean,
    handleClose?: () => void,
    deleteHandle: () => void
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

const DeleteContainerModal: FC<IProps> = ({open, handleClose, deleteHandle}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            keepMounted
        >
            <Box sx={{ ...style, width: 600 }}>
                <h2>Удаление блока</h2>

                <Typography paragraph>
                    Вы действительно хотите удалить блок контента?
                </Typography>

                <Stack
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Button variant="text" onClick={handleClose}>
                        Отмена
                    </Button>

                    <Button variant="text" color="error" onClick={deleteHandle}>
                        Удалить
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
    
}

export default DeleteContainerModal