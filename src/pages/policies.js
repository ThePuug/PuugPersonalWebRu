import React from "react"
import { graphql } from "gatsby"
import { Container, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from "gatsby-plugin-react-i18next"
import Nav from "../components/Nav"
import Footer from "../components/Footer"

const Page = (props) => {
  const { t } = useTranslation("policies")
  return (<>
    <Nav />
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Paper css={{padding:`1rem`}}>
          <Typography variant="title" component="h4">{t('privacyPolicy')}</Typography>
          <Typography variant="body1">We'll never sell your data or spam your email.</Typography>
        </Paper>
        <Paper css={{padding:`1rem`}}>
          <Typography variant="title" component="h4">{t('termsOfService')}</Typography>
          <Typography variant="body1">We protect your data to the best of our ability, and you accept the risks associated with using the site.</Typography>
        </Paper>
      </Stack>
    </Container>
    <Footer />
  </>)
}

export default Page

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;