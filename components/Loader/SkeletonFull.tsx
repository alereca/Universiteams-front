import React from 'react'
import { Box, Skeleton } from '@mantine/core'

const SkeletonFull = () => {
  return (
    <Box mt={6} mx={20}>
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <br />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <br />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <br />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </Box>
  )
}

export default SkeletonFull
