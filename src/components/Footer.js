'use client'
import React from "react"
import { Box, Container, Stack, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useTranslation } from "react-i18next"
import { Link } from "@/components/i18n-provider"

const Component = (props) => {
  const { t } = useTranslation("_footer")
  return <>
    <Box component="footer" aria-hidden={false} sx={{ mt: { xs: 4, md: 6 } }}>
      {/* coral hand-drawn ground line echoing the logo */}
      <Box aria-hidden sx={{ color: '#f97d7d', lineHeight: 0 }}>
        <svg viewBox="0 0 1200 12" width="100%" height="9" fill="none" preserveAspectRatio="none">
          <path d="M0 6 Q60 1 120 6 T240 6 T360 6 T480 6 T600 6 T720 6 T840 6 T960 6 T1080 6 T1200 6"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </Box>
      <Tint>
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1.5, py: 2.5 }}>
            <Link to="/">{t('linkHome')}</Link>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Dot c="#f97dd9" /><Dot c="#c77ee0" /><Dot c="#f9ee7a" />
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>{t('companyName')} ©&nbsp;{new Date().getFullYear()}</Typography>
            </Stack>
            <Link to="/policies">{t('linkPolicies')}</Link>
          </Stack>
        </Container>
      </Tint>
    </Box>
  </>
}

const Dot = ({ c }) => <Box aria-hidden component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: c, display: 'inline-block' }} />

// Soft pink-tint ground (keeps the brand pink identity) with AA-safe periwinkle links
const Tint = styled('div')(({ theme }) => ({
  backgroundColor: '#FFF0F8',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 600,
    textUnderlineOffset: '3px',
  },
  '& a:hover': { textDecoration: 'underline' },
}))

export default Component;
