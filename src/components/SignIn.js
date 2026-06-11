'use client'
import React, {useState, useEffect} from 'react'
import { Button, Container, Dialog, FormHelperText, Stack, Typography } from '@mui/material';
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { auth, getUser, setUser, logout } from "@/lib/firebase"
import { useTranslation } from 'react-i18next';
import Loads from "./Loads"

const Component = (props) => {
  const { t } = useTranslation("_signIn")
  const { onSuccess, onClose, ...rest } = props
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [isSignedIn,setIsSignedIn] = useState(false)

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, user => setIsSignedIn(!!user));
    return () => unregisterAuthObserver();
  }, []);

  const handleSignIn = async (makeProvider) => {
    setLoading(true); setError(null)
    try {
      const result = await signInWithPopup(auth, makeProvider())
      setUser(result.user)
      onSuccess()
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {}
      else if (err.code === 'auth/account-exists-with-different-credential') setError(t('errors.accountExists'))
      else setError(t('errors.signInFailed'))
    } finally { setLoading(false) }
  }

  return (<>
    <Loads component={Dialog} loading={loading} onClose={onClose} {...rest} maxWidth="xs" css={{textAlign:`center`}}>
      <Container css={{margin:`1em auto`}}>
        {isSignedIn && <>
          <Typography variant="subtitle2">{t("signedInAs")} {getUser().displayName}</Typography>
          <Button variant="outlined" color="secondary" onClick={async () => { await logout(); onClose(); }}>Log out</Button>
        </>}
        {!isSignedIn && <>
          <Typography variant="subtitle2">{t('signInToProceed')}</Typography>
          <Stack spacing={1} css={{margin:`1em 0`}}>
            <Button variant="contained" disabled={loading} onClick={() => handleSignIn(() => {
              const provider = new GoogleAuthProvider()
              provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
              return provider
            })}>{t('signInWithGoogle')}</Button>
            <Button variant="contained" disabled={loading} onClick={() => handleSignIn(() => {
              const provider = new FacebookAuthProvider()
              provider.addScope('user_birthday')
              provider.addScope('public_profile')
              return provider
            })}>{t('signInWithFacebook')}</Button>
          </Stack>
          {error && <FormHelperText error>{error}</FormHelperText>}
        </>}
      </Container>
    </Loads>
  </>)
}

export default Component
