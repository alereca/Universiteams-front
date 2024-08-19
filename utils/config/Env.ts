//////////// ENV TOOLS ////////////

// Working mode
const mode: string = 'dev' // To-Do: move this variable into a .env file

// Base backend API
const backendAPI: string =
  mode == 'prod' // To-Do: there should be a value for prod in the general .env file
    ? process.env.NEXT_PUBLIC_BACKEND_HOST ?? ''
    : process.env.NEXT_PUBLIC_BACKEND_HOST ?? ''

// Team 120 contact mail
const contactMail: string = process.env.NEXT_PUBLIC_CONTACT ?? ''

const Env = { mode, backendAPI, contactMail }
export default Env
