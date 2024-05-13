import { Drawer, SxProps } from '@mui/material'
import { FC, ReactNode } from 'react'
import theme from '../../theme'

interface ISidebar {
  children?: ReactNode
  sx?: SxProps<typeof theme>
}

const Sidebar: FC<ISidebar> = ({ children, sx }) => {
  return (
    <Drawer sx={sx} variant="permanent">
      {children}
    </Drawer>
  )
}

export default Sidebar
