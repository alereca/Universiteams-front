import React, { forwardRef } from 'react'
import { UnstyledButton, Group, Avatar, Text, Flex } from '@mantine/core'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  profileIcon: React.ReactNode
  name: string
  email: string
  isMenuOpen?: boolean
}

const UserBanner = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ profileIcon, name, email, isMenuOpen, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: 'var(--mantine-spacing-md)',
        color: 'var(--mantine-color-text)',
        borderRadius: 'var(--mantine-radius-sm)',
        width: '100%',
      }}
      {...others}>
      <Flex align="center" justify="space-between">
        <Group>
          <Avatar radius="xl">{profileIcon}</Avatar>
          <div style={{ maxWidth: 'calc(100% - 60px)' }}>
            <Text size="sm" fw={500} truncate>
              {name}
            </Text>
            <Text c="dimmed" size="xs" truncate>
              {email}
            </Text>
          </div>
        </Group>
        {isMenuOpen ? (
          <IconChevronDown size="1rem" style={{ flexShrink: 0 }} />
        ) : (
          <IconChevronRight size="1rem" style={{ flexShrink: 0 }} />
        )}
      </Flex>
    </UnstyledButton>
  )
)

UserBanner.displayName = 'UserBanner'

export default UserBanner
