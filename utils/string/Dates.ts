//////////// DATE TOOLS ////////////

// A simple date formatter function to format the date strings
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Get current date & time with a filename-friendly format
const getDateTimeShort = () => {
  return new Date().toISOString().replace(/:/g, '-').replace('T', '_').split('.')[0]
}

const Dates = { getDateTimeShort, formatDate }
export default Dates
