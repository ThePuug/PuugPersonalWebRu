'use client'
import React from "react"
import { Box, Button, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { Link } from "@/components/i18n-provider"

const NotFound = () => {
  const { t } = useTranslation("index")
  return (<>
    <Nav />
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ textAlign: 'center', py: { xs: 8, md: 14 } }}>
        <Typography variant="h1" sx={{ color: 'primary.main', fontSize: 'clamp(3.5rem, 16vw, 7rem)', lineHeight: 1 }}>404</Typography>
        <Typography variant="h5" component="p" sx={{ mt: 2, color: 'text.secondary' }}>{t('notFound.title')}</Typography>
        <Button component={Link} to="/" variant="outlined" sx={{ mt: 4, borderRadius: 999, px: 3 }}>{t('notFound.back')}</Button>
      </Box>
    </Container>
    <Footer />
  </>)
}

export default NotFound
