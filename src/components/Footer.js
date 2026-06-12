'use client'
import React from "react"
import { Container, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useTranslation } from "react-i18next"
import { Link } from "@/components/i18n-provider"

const Component = (props) => {
  const { t } = useTranslation("_footer")
  return <>
    <Footer maxWidth={false}>
      <Container maxWidth="md">
        <Stack direction='row' sx={{justifyContent:'space-between', alignItems:'center'}} spacing={1}>
          <Link to="/">{t('linkHome')}</Link>
          <Typography variant="body1">{t('companyName')} ©&nbsp;{new Date().getFullYear()}</Typography>
          <Link to="/policies">{t('linkPolicies')}</Link>
        </Stack>
      </Container>
    </Footer>
  </>
}

const Footer = styled(Container)`
  background-color:${props => props.theme.palette.pink.main};
  margin:1em 0;
`

export default Component;
