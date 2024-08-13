import React from 'react'
import { IconAlertOctagon, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react'
import { Flex, Text } from '@mantine/core'
import MessageType from '@/entities/HelpTypes/MessageType'

interface MessageProps {
  text: string
  type?: MessageType
}

const Message = (props: MessageProps) => {
  const setIcon = (): JSX.Element => {
    const type = props.type ?? 'info'
    switch (type) {
      case 'error':
        return <IconAlertOctagon color="red" size={'2.5rem'} />
      case 'warning':
        return <IconAlertTriangle color="yellow" size={'2.5rem'} />
      case 'info':
      default:
        return <IconInfoCircle color="lightblue" size={'2.5rem'} />
    }
  }

  const icon = setIcon()

  return (
    <Flex m={20} p={20} bg="var(--mantine-color-gray-light)" align={'center'}>
      {icon}{' '}
      <Text ml={10} size="1.2rem">
        {props.text}
      </Text>
    </Flex>
  )
}

export default Message
