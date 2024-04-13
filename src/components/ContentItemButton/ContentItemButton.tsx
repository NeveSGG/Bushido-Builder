import { FC } from 'react'

import Button, { ButtonProps, buttonClasses } from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import FontIcon from '../FontIcon'

const CustomMuiButtonBase = styled(Button)<ButtonProps>(({ theme }) => ({
  boxShadow: 'none',
  display: 'flex',
  flexDirection: 'column',
  color: theme.palette.text.primary,
  borderColor: 'rgba(255, 255, 255, 0.12)',
  backgroundColor: theme.palette.background.default,
  textTransform: 'unset',
  width: 'min-content',
  [`& .${buttonClasses.startIcon}`]: {
    paddingTop: 10,
    paddingBottom: 10,
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

const ContentItemButton: FC = () => {
  return (
    <CustomMuiButtonBase
      variant="outlined"
      disableRipple
      startIcon={<FontIcon />}
      color="success"
    >
      Текстовый текст здоровый f ye nfr yjhv? gj`lqn`
    </CustomMuiButtonBase>
  )
}

export default ContentItemButton
