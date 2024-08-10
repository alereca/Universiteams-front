import React, { useCallback } from 'react'
import { Box, Flex, Text } from '@mantine/core'
import CustomLink from '@/components/Common/CustomLink/CustomLink'
import useSidebarStore from '../useSidebarStore'
import { useMediaQuery } from '@mantine/hooks'
import Theme from '../../../src/app/theme'

interface INavbarItem {
  text: string
  textSecondLine?: string
  link?: string
  icon?: JSX.Element
  small?: boolean
}

const NavbarItem = ({ text, textSecondLine, link, icon, small = false }: INavbarItem) => {
  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)
  const toggle = useSidebarStore((state) => state.toggle)

  const handleClick = () => {
    if (isMobile) {
      toggle()
    }
  }

  const truncateTextStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  }

  const itemContent = useCallback(
    () => (
      <Flex
        h={small ? 45 : 60}
        bg="var(--mantine-color-gray-light)"
        pl={20}
        onClick={handleClick}
        align="center"
        gap={20}
        role="button"
        tabIndex={0}>
        <Box style={{ flexShrink: 0 }}>{icon && icon}</Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text style={truncateTextStyle}>{text}</Text>
          {textSecondLine && (
            <Text size="sm" style={truncateTextStyle}>
              {textSecondLine}
            </Text>
          )}
        </Box>
      </Flex>
    ),
    [text, textSecondLine, icon, small, isMobile]
  )

  return link ? <CustomLink link={link} content={itemContent()} /> : itemContent()
}

export default NavbarItem
