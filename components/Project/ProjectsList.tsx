import React, { Suspense } from 'react'
import { List } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import Theme from 'src/app/theme'
import ProjectInList from '@/entities/Project/ProjectInList'
import ProjectItem from './ProjectItem'
import SkeletonFull from '../Common/Loader/SkeletonFull'
import InfoMessage from '../Common/InfoMessage/InfoMessage'

interface ProjectsListProps {
  projects?: ProjectInList[]
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  const isMobile = useMediaQuery(`(max-width: ${Theme.breakpoints?.lg})`)

  if (projects === undefined) return <SkeletonFull />
  if (projects.length == 0) return <InfoMessage text="Aún no tienes proyectos" type="info" />

  return (
    <Suspense fallback={<SkeletonFull />}>
      <List ml={!isMobile ? 'xs' : 0}>
        {projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </List>
    </Suspense>
  )
}

export default ProjectsList
