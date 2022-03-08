import { createTheme } from "@mui/material/styles"
import { blueGrey, lightBlue, lightGreen } from "@mui/material/colors"

const theme = createTheme({
    palette: {
      freeSlot: { main: lightBlue[50] },
      mySlot: { main: lightGreen[500] },
      bookedSlot: { main: blueGrey[300] },
      yellow: { main: '#f9ee7a' },
      pink: { main: '#f97dd9' },
      teal: { main: '#6cf4d5' },
      blue: { main: '#6cd2f4' },
      purple: { main: '#907df9' },
      orange: { main: '#f9ab79' },
      red: { main: '#f97d7d' }
    },
  })
  
  export default theme