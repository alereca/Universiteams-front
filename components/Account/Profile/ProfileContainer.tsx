import React, { ReactNode } from 'react'
import { Container, Paper, PaperProps } from '@mantine/core'

interface ProfileContainerProps extends PaperProps {
  children: ReactNode
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ children, ...paperProps }) => {
  return (
    <Container size="100%" px="xs" my={40}>
      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
        style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}
        {...paperProps}>
        {children}
      </Paper>
    </Container>
  )
}

export default ProfileContainer
