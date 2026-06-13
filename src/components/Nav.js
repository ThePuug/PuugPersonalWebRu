'use client'
import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Avatar, Button, ButtonGroup, Container, IconButton, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, getUser } from "@/lib/firebase"
import { useTranslation } from 'react-i18next';
import { Link, useI18next } from '@/components/i18n-provider';
import SignIn from './SignIn';

const Component = () => {
  const {t,i18n} = useTranslation(['_signIn','_footer'])
  const [isSignedIn,setIsSignedIn] = useState(false)
  const [signingIn,setSigningIn] = useState(false)
  const {languages,originalPath} = useI18next()

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, user => setIsSignedIn(!!user));
    return () => unregisterAuthObserver();
  }, []);

  const ringSx = { border: '1.5px solid', borderColor: 'primary.main', color: 'primary.main' }

  return <>
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Stack direction='row' sx={{ justifyContent: "space-between", alignItems: "center", py: { xs: 1.5, md: 2 }, borderBottom: '1px solid rgba(91,75,196,0.10)' }} spacing={1}>
        <Stack direction='row' sx={{alignItems:"center"}} spacing={1.5}>
          <Link to="/" aria-label={t('linkHome', { ns: '_footer' })}><img src="/images/logo.png" width={64} alt="" style={{display:'block'}} /></Link>
          <LangSwitch disableElevation variant="text">
            <Button to={originalPath} language="bg" component={Link} data-selected={i18n.language === 'bg'}>БГ</Button>
            <Button to={originalPath} language="en" component={Link} data-selected={i18n.language === 'en'}>EN</Button>
          </LangSwitch>
        </Stack>
        {isSignedIn && <IconButton aria-label={t('openAccount')} onClick={() => setSigningIn(true)} sx={{ p: 0.25, ...ringSx }}>
          <Avatar src={getUser().photoURL} sx={{ width: 30, height: 30 }} />
        </IconButton>}
        {!isSignedIn && <IconButton aria-label={t('openSignIn')} onClick={() => setSigningIn(true)} sx={ringSx}><PersonIcon /></IconButton>}
      </Stack>
    </Container>
    <SignIn open={signingIn} onSuccess={() => setSigningIn(false)} onClose={() => setSigningIn(false)} />
  </>
}

// Transparent switch; the active language is marked by a hand-drawn yellow underline
// (the brand yellow survives as an accent, not a filled block).
const LangSwitch = styled(ButtonGroup)(({ theme }) => ({
  boxShadow: 'none',
  '& .MuiButtonGroup-grouped': {
    border: 'none',
    minWidth: 44,
    minHeight: 44,
    paddingInline: 10,
    color: theme.palette.text.secondary,
    background: 'transparent',
    fontWeight: 600,
    borderRadius: 8,
    '&:hover': { background: 'rgba(91,75,196,0.08)', border: 'none' },
  },
  '& .MuiButton-root[data-selected=true]': {
    color: theme.palette.text.primary,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 9,
      right: 9,
      bottom: 7,
      height: 3,
      borderRadius: 3,
      background: theme.palette.yellow.main,
    },
  },
}))

export default Component
