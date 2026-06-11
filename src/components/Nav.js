'use client'
import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Avatar, Button, ButtonGroup, Container, Stack } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, getUser } from "@/lib/firebase"
import { useTranslation } from 'react-i18next';
import { Link, useI18next } from '@/components/i18n-provider';
import SignIn from './SignIn';

const Component = () => {
  const {t,i18n} = useTranslation()
  const [isSignedIn,setIsSignedIn] = useState(false)
  const [signingIn,setSigningIn] = useState(false)
  const {languages,originalPath} = useI18next()

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, user => setIsSignedIn(!!user));
    return () => unregisterAuthObserver();
  }, []);

  return <>
    <Container maxWidth="md">
      <Stack direction='row' justifyContent="space-between" alignItems="center" spacing={1}>
        <Stack direction='row' alignItems="center" spacing={1}>
          <Link to="/"><img src="/images/logo.png" width={75} alt="" style={{display:'block'}} /></Link>
          <LangSwitch>
            <Button to={originalPath} language="bg" component={Link} data-selected={i18n.language === 'bg'}>БГ</Button>
            <Button to={originalPath} language="en" component={Link} data-selected={i18n.language === 'en'}>EN</Button>
          </LangSwitch>
        </Stack>
        {isSignedIn && <Avatar src={getUser().photoURL} onClick={() => setSigningIn(true) }>Logout</Avatar>}
        {!isSignedIn && <Avatar onClick={() => {setSigningIn(true)}}><PersonIcon /></Avatar>}
      </Stack>
    </Container>
    <SignIn open={signingIn} onSuccess={() => setSigningIn(false)} onClose={() => setSigningIn(false)} />
  </>
}

const LangSwitch = styled(ButtonGroup)`
  background-color:${props => props.theme.palette.yellow.main};
  .MuiButton-root {
    background-color:rgba(0,0,0,.15);
    &[data-selected=true] {
      background-color:transparent;
    }
  }
`

export default Component
