'use client'
import React from 'react'
import ProjectDetails from '@/components/Project/ProjectDetails'

interface ProjectDetailsParams {
  params: { id: number }
}

const ProjectDetailsPage = ({ params }: ProjectDetailsParams) => {
  return <ProjectDetails id={params.id} />
}

export default ProjectDetailsPage
