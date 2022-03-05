import React from 'react'
import PropTypes from 'prop-types'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core/styles'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Helmet } from 'gatsby-plugin-react-i18next';
import theme from '../theme'

const stripe = loadStripe(process.env.GATSBY_STRIPE_PUBLIC_KEY)

export default function TopLayout(props) {
  return (<>
    <Helmet>
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <title>Regain Us</title>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet" />
    </Helmet>
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Elements stripe={stripe}>
          <CssBaseline />
          {props.children}
        </Elements>
      </StyledEngineProvider>
    </ThemeProvider>
  </>)
}

TopLayout.propTypes = {
  children: PropTypes.node,
};