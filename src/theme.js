import { createTheme } from "@material-ui/core"
import { blueGrey, lightBlue, lightGreen } from "@material-ui/core/colors"

const theme = createTheme({
    palette: {
      freeSlot: { main: lightBlue[50] },
      mySlot: { main: lightGreen[500] },
      bookedSlot: { main: blueGrey[300] },
      yellow: { main: '#f9ee78' },
      pink: { main: '#f87bd7' },
      teal: { main: '#69f4d3' },
      blue: { main: '#68d0f3' },
      orange: { main: '#faaa77' }
    },
  })
  
  export default theme