'use client'
import React from 'react'
import UserDetails from '@/components/User/UserDetails'

interface UserDetailsParams {
  params: { id: number }
}

const UserDetailsPage = ({ params }: UserDetailsParams) => {
  return <UserDetails id={params.id} />
}

export default UserDetailsPage
