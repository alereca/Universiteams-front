//////////// VALIDATION TOOLS ////////////
const url = (value?: string) => {
  if (!value) return null
  try {
    new URL(value)
    return null
  } catch {
    return 'La dirección web no es válida'
  }
}

const Validation = { url }
export default Validation
