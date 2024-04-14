import { FC, useMemo } from 'react'

import Button, { ButtonProps, buttonClasses } from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import FontIcon from '../FontIcon'
import truncateString from '../../helpers/truncateString'

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

const rawText = 'Текстовый'
const textLength = 17

const ContentItemButton: FC = () => {
  const textToShow = useMemo(
    () => truncateString(rawText, textLength),
    [rawText, textLength]
  )

  return (
    <CustomMuiButtonBase
      variant="outlined"
      disableRipple
      startIcon={<FontIcon />}
      color="success"
    >
      {textToShow}
    </CustomMuiButtonBase>
  )
}

export default ContentItemButton
