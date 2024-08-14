import React, { forwardRef } from 'react'
import { UnstyledButton, Group, Avatar, Text } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  profileIcon: React.ReactNode
  name: string
  email: string
}

const UserBanner = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ profileIcon, name, email, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      style={{
        padding: 'var(--mantine-spacing-md)',
        color: 'var(--mantine-color-text)',
        borderRadius: 'var(--mantine-radius-sm)',
      }}
      {...others}>
      <Group>
        <Avatar radius="xl">{profileIcon}</Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        <IconChevronRight size="1rem" />
      </Group>
    </UnstyledButton>
  )
)

UserBanner.displayName = 'UserBanner'

export default UserBanner
