import React from 'react'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { Html } from 'react-pdf-html'
import Localize from 'utils/string/Localize'

import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import Project from '@/entities/Project/Project'
import ResearchDepartment from '@/entities/ResearchDepartment'

const styles = StyleSheet.create({
  page: {
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 24,
  },
  subtitleMain: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  subtitleSection: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
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
    backgroundColor: '#bdbdbd',
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
        { label: 'Idioma', value: Localize.projectLanguage(project.language) },
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
            <Text style={styles.tableCell}>{Localize.projectRole(enrollment.role)}</Text>
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
        <Image src="/universiteams_banner.png" />
        <Text style={styles.title}>Reporte de proyecto</Text>
        <Text style={styles.subtitleMain}>{project.name}</Text>
        <Text style={styles.subtitleSection}>Descripción:</Text>
        <Html style={styles.text}>{project.description.trim()}</Html>

        {createProjectDetailsTable()}

        {project.web && <Text style={styles.text}>Web: {project.web}</Text>}

        {Array.isArray(project.interests) && project.interests.length > 0 && (
          <View>
            <Text style={styles.subtitleSection}>Intereses:</Text>
            {project.interests.map((interest: Interest) => (
              <Text key={interest.id} style={styles.text}>
                • {interest.name}
              </Text>
            ))}
          </View>
        )}

        {Array.isArray(project.researchDepartments) && project.researchDepartments.length > 0 && (
          <View>
            <Text style={styles.subtitleSection}>Departamentos de investigación:</Text>
            {createResearchDepartmentsTable()}
          </View>
        )}

        {Array.isArray(project.enrollments) && project.enrollments.length > 0 && (
          <View>
            <Text style={styles.subtitleSection}>Miembros ({project.userCount}):</Text>
            {createMembersTable()}
          </View>
        )}
      </Page>
    </Document>
  )
}

export default ProjectPDF
