import React, {useState} from 'react'
import { Button, Container, Dialog, Typography } from '@mui/material';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { isLoggedIn, getUser, setUser, logout } from "../firebase"
import { useTranslation } from 'gatsby-plugin-react-i18next';
import firebase from "gatsby-plugin-firebase"
import Loads from "./Loads"

const Component = (props) => {
  const { t,i18n } = useTranslation("_signIn")
  const { onSuccess, onClose, ...rest } = props
  const [loading,setLoading] = useState(false)

  const getUiConfig = (auth) => ({
    signInFlow: 'popup',
    signInOptions: [{
      provider: auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [ 'https://www.googleapis.com/auth/userinfo.profile' ],
    },
    {
      provider: auth.FacebookAuthProvider.PROVIDER_ID,
      scopes: [ 'user_birthday', 'public_profile' ],
    }],
    callbacks: {
      signInSuccessWithAuthResult: async (result) => {
        setUser(result.user)
        onSuccess()
      },
    }
  })

  return (<>
    {!!firebase.auth && <Loads component={Dialog} loading={loading} onClose={onClose} {...rest} maxWidth="xs" css={{textAlign:`center`}}>
      <Container css={{margin:`1em auto`}}>
        {isLoggedIn() && <>
          <Typography variant="subtitle2">{t("signedInAs")} {getUser().displayName}</Typography>
          <Button variant="outlined" color="secondary" onClick={() => { logout(firebase); onClose(); }}>Log out</Button>
        </>}
        {!isLoggedIn() && <>
          <Typography variant="subtitle2">{t('signInToProceed')}</Typography>
          {<StyledFirebaseAuth uiConfig={getUiConfig(firebase.auth)} firebaseAuth={firebase.auth()}/>}
        </>}
      </Container>
    </Loads>}
  </>)
}

export default Component