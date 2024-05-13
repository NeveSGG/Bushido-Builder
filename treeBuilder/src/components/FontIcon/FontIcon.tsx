import { FC, memo } from 'react'
import Icon from '@mui/material/Icon'

export interface IFontIcon {
  name?: string
}

const FontIcon: FC<IFontIcon> = ({ name }) => {
  // const [isActive, setIsActive] = useState<boolean>(false)

  return (
    <Icon
    // baseClassName={isActive ? 'material-icons' : 'material-icons-two-tone'}
    // onMouseEnter={() => setIsActive(true)}
    // onMouseLeave={() => setIsActive(false)}
    >
      {name ?? 'add_circle'}
    </Icon>
  )
}

export default memo(FontIcon)
