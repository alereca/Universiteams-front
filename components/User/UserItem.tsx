import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge, Card, Chip, Flex, Group, Text, useMantineColorScheme } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'
import styles from './UserItem.module.css'

import { Url } from '@/services/url'

import InfoMessage from '../Common/InfoMessage/InfoMessage'
import Interest from '@/entities/Interest'
import User from '@/entities/User/User'
import UserAffiliation from '@/entities/User/UserAffiliation'
import { UserDetailsTabs } from './UserDetails'

interface UserItemProps {
  user?: User
}

const UserItem = (props: UserItemProps) => {
  const user = props.user

  const searchQuery = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { colorScheme } = useMantineColorScheme()

  const handleInterestTagClick = (interestId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    Url.appendToUrl(router, pathname, searchQuery, 'interest', [interestId.toString()])
  }

  const handleDepartmentBadgeClick = (
    institutionId: number,
    facilityId: number,
    departmentId: number,
    event: React.MouseEvent
  ) => {
    event.stopPropagation()
    let modifiedSearchQuery = searchQuery
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      searchQuery,
      'university',
      institutionId.toString()
    )
    modifiedSearchQuery = Url.setUrlParam(
      router,
      pathname,
      modifiedSearchQuery,
      'facility',
      facilityId.toString()
    )
    Url.setUrlParam(router, pathname, modifiedSearchQuery, 'department', departmentId.toString())
  }

  if (!user) return <InfoMessage text="No se ha podido cargar el usuario" type="error" />

  return (
    <Card
      key={user.id}
      mx="md"
      mb="0.5rem"
      p="md"
      radius="md"
      onClick={() => router.push(`/users/${user.id}?activeTab=${UserDetailsTabs.Projects}`)}
      className={`${styles.card} ${colorScheme == 'dark' ? styles.cardDark : styles.cardLight}`}>
      <div style={{ width: '100%' }}>
        <Flex direction={'row'} align={'center'} gap={10}>
          <IconUser size={20} />
          <Text style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: '1.75rem' }}>
            {user.firstName} {user.lastName}
          </Text>
        </Flex>

        <Chip.Group>
          <Group gap={'1rem'} mt={'1rem'}>
            {Array.isArray(user.userAffiliations) &&
              user.userAffiliations.length > 0 &&
              user.userAffiliations.map((affiliation: UserAffiliation) => (
                <Badge
                  key={affiliation.id}
                  color="pink.6"
                  variant="light"
                  component="button"
                  style={{ cursor: 'pointer' }}
                  onClick={(event) =>
                    handleDepartmentBadgeClick(
                      affiliation.researchDepartment.facility.institution.id,
                      affiliation.researchDepartment.facility.id,
                      affiliation.researchDepartment.id,
                      event
                    )
                  }>
                  {affiliation.researchDepartment.facility.institution.abbreviation} |{' '}
                  {affiliation.researchDepartment.facility.abbreviation} |{' '}
                  {affiliation.researchDepartment.name}
                </Badge>
              ))}
          </Group>
          <Group gap={'0.5rem'} mt={'1rem'}>
            {Array.isArray(user.interests) &&
              user.interests.length > 0 &&
              user.interests.map((interest: Interest) => (
                <Badge
                  variant="dot"
                  key={interest.id}
                  color="blue.6"
                  size="lg"
                  style={{ cursor: 'pointer' }}
                  onClick={(event) => handleInterestTagClick(interest.id, event)}>
                  {interest.name}
                </Badge>
              ))}
          </Group>
        </Chip.Group>
      </div>
    </Card>
  )
}

export default UserItem
