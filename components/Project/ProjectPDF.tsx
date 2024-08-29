import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Html } from 'react-pdf-html'
import Project from '@/entities/Project/Project'
import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import ResearchDepartment from '@/entities/ResearchDepartment'
import { localizeProjectLanguage, localizeProjectRole } from '../../utils/string/Localize'

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
  },
  tableCellLeft: {
    width: '30%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
  },
  tableCellRight: {
    width: '70%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
  },
  tableCellEqual: {
    width: '33.33%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
  },
  tableCellEqualFirst: {
    width: '33.33%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
  },
})

interface ProjectPDFProps {
  project: Project
}

const ProjectPDF: React.FC<ProjectPDFProps> = ({ project }) => {
  const createProjectDetailsTable = () => (
    <View style={styles.table}>
      {[
        { label: 'Tipo', value: project.type },
        { label: 'Idioma', value: localizeProjectLanguage(project.language) },
        { label: 'Fecha creación', value: project.creationDate },
        { label: 'Cantidad de favoritos', value: project.favoriteCount.toString() },
      ].map((row, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={[styles.tableCellLeft, styles.tableCellHeader]}>
            <Text style={styles.tableCell}>{row.label}</Text>
          </View>
          <View style={styles.tableCellRight}>
            <Text style={styles.tableCell}>{row.value}</Text>
          </View>
        </View>
      ))}
    </View>
  )

  const createMembersTable = () => (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCellEqualFirst, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Nombre</Text>
        </View>
        <View style={[styles.tableCellEqual, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Rol</Text>
        </View>
      </View>
      {project.enrollments.map((enrollment: Enrollment) => (
        <View key={enrollment.id} style={styles.tableRow}>
          <View style={styles.tableCellEqualFirst}>
            <Text
              style={
                styles.tableCell
              }>{`${enrollment.user.firstName} ${enrollment.user.lastName}`}</Text>
          </View>
          <View style={styles.tableCellEqual}>
            <Text style={styles.tableCell}>{localizeProjectRole(enrollment.role)}</Text>
          </View>
        </View>
      ))}
    </View>
  )

  const createResearchDepartmentsTable = () => (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <View style={[styles.tableCellEqualFirst, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Institución</Text>
        </View>
        <View style={[styles.tableCellEqual, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Regional</Text>
        </View>
        <View style={[styles.tableCellEqual, styles.tableCellHeader]}>
          <Text style={styles.tableCell}>Departamento</Text>
        </View>
      </View>
      {project.researchDepartments.map((department: ResearchDepartment) => (
        <View key={department.id} style={styles.tableRow}>
          <View style={styles.tableCellEqualFirst}>
            <Text style={styles.tableCell}>{department.facility.institution.name}</Text>
          </View>
          <View style={styles.tableCellEqual}>
            <Text style={styles.tableCell}>{department.facility.name}</Text>
          </View>
          <View style={styles.tableCellEqual}>
            <Text style={styles.tableCell}>{department.name}</Text>
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{project.name}</Text>
        <Text style={styles.subtitle}>Descripción:</Text>
        <Html style={styles.text}>{project.description.trim()}</Html>

        {createProjectDetailsTable()}

        {project.web && <Text style={styles.text}>Web: {project.web}</Text>}

        {Array.isArray(project.interests) && project.interests.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Intereses:</Text>
            {project.interests.map((interest: Interest) => (
              <Text key={interest.id} style={styles.text}>
                • {interest.name}
              </Text>
            ))}
          </View>
        )}

        {Array.isArray(project.researchDepartments) && project.researchDepartments.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Departamentos de investigación:</Text>
            {createResearchDepartmentsTable()}
          </View>
        )}

        {Array.isArray(project.enrollments) && project.enrollments.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Miembros ({project.userCount}):</Text>
            {createMembersTable()}
          </View>
        )}
      </Page>
    </Document>
  )
}

export default ProjectPDF
