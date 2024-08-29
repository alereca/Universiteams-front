import React from 'react'
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import Localize from 'utils/string/Localize'

import Enrollment from '@/entities/Enrollment/Enrollment'
import Interest from '@/entities/Interest'
import User from '@/entities/User/User'
import UserAffiliation from '@/entities/User/UserAffiliation'

const styles = StyleSheet.create({
  page: {
    paddingTop: 16,
    paddingHorizontal: 40,
    paddingBottom: 56,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 10,
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
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#bdbdbd',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    textAlign: 'center',
    margin: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    textAlign: 'center',
    margin: 5,
    fontSize: 10,
  },
})

interface UserPDFProps {
  user: User
}

const UserPDF: React.FC<UserPDFProps> = ({ user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image src="/universiteams_banner.png" />
      <View style={styles.section}>
        <Text style={styles.title}>Reporte de usuario</Text>
        <Text style={styles.subtitle}>
          {user.firstName} {user.lastName}
        </Text>

        {Array.isArray(user.interests) && user.interests.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Intereses:</Text>
            {user.interests.map((interest: Interest) => (
              <Text key={interest.id} style={styles.listItem}>
                • {interest.name}
              </Text>
            ))}
          </View>
        )}

        {Array.isArray(user.userAffiliations) && user.userAffiliations.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Afiliaciones:</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Institución</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Regional</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Departamento</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Rol</Text>
                </View>
              </View>
              {user.userAffiliations.map((affiliation: UserAffiliation) => (
                <View key={affiliation.id} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {affiliation.researchDepartment.facility.institution.name}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {affiliation.researchDepartment.facility.name}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{affiliation.researchDepartment.name}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {Localize.affiliationType(affiliation.currentType)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {Array.isArray(user.enrollments) && user.enrollments.length > 0 && (
          <View>
            <Text style={styles.subtitle}>Proyectos donde participa:</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: '70%' }]}>
                  <Text style={styles.tableCellHeader}>Nombre</Text>
                </View>
                <View style={[styles.tableColHeader, { width: '30%' }]}>
                  <Text style={styles.tableCellHeader}>Rol</Text>
                </View>
              </View>
              {user.enrollments.map((enrollment: Enrollment) => (
                <View key={enrollment.id} style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: '70%' }]}>
                    <Text style={styles.tableCell}>{enrollment.project.name}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '30%' }]}>
                    <Text style={styles.tableCell}>{Localize.projectRole(enrollment.role)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Page>
  </Document>
)

export default UserPDF
