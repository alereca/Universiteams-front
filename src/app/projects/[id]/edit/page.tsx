'use client'
import React from 'react'

import ProjectCreateUpdate from '@/components/Project/ProjectCreateUpdate'
import InfoMessage from '@/components/Common/InfoMessage/InfoMessage'

interface ProjectEditPageParams {
  params: { id: number }
}

const ProjectEditPage = ({ params }: ProjectEditPageParams) => {
  if (params.id <= 0) {
    return (
      <InfoMessage type="error" text="No se ha enviado un ID correcto de proyecto en esta ruta" />
    )
  }

  return <ProjectCreateUpdate id={params.id} />
}

export default ProjectEditPage
