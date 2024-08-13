import ProjectInList from './ProjectInList'

// Projects with complementary info
interface ProjectsResult {
  projects: ProjectInList[]
  suggestedSearchTerms?: string[]
  projectCount: number
}

export default ProjectsResult
