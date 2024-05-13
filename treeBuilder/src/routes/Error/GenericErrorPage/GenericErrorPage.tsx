import { Box, Container, Typography } from '@mui/material'
import { FC } from 'react'

const GenericErrorPage: FC = () => {
  return (
    <Container>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component="h1">404</Typography>
      </Box>
    </Container>
  )
}

export default GenericErrorPage
