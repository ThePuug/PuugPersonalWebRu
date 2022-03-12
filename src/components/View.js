import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Drawer, FormHelperText, IconButton, FormControl, FormLabel, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/lab"
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { useTranslation } from "gatsby-plugin-react-i18next";
import { DateTime } from 'luxon'
import firebase from "gatsby-plugin-firebase"
import { isLoggedIn } from "../firebase"

const Component = (props) => {
  const { t } = useTranslation('_view')
  const { event, onClose, onDelete, onUpdate, ...rest } = props
  const [permissions,setPermissions] = useState({})
  const [isSignedIn,setIsSignedIn] = useState(isLoggedIn)
  const [sessionType,setSessionType] = useState("")
  const [userEmail,setUserEmail] = useState("")
  const [date,setDate] = useState("")
  const [confirmDelete,setConfirmDelete] = useState(false)
  const [confirmRefund,setConfirmRefund] = useState(false)
  const [error,setError] = useState(null)

  const handleClose = () => {
    setConfirmDelete(false)
    setConfirmRefund(false)
    setError(false)
    onClose()
  }
  const handleDelete = async (id) => {
    try {
      setError(false)
      await firebase.app().functions("europe-central2").httpsCallable('deleteBooking')({id})
      setConfirmDelete(false)
      onDelete(id)
    } catch (error) {
      setError(`Something went wrong: ${error.message}`)
    }
  }
  const handleUpdate = async (event) => {
    try {
      setError(false)
      var response = await firebase.app().functions("europe-central2").httpsCallable('updateBooking')({
        id: event.id,
        date: date.setZone('Europe/Sofia').toMillis(),
        sessionType,
        userEmail})
      onUpdate({...response.data,
        date: DateTime.fromMillis(response.data.date)})
    } catch (error) {
      setError(`Something went wrong: ${error.message}`)
    }
  }
  const handleCancelDelete = () => {
    setConfirmDelete(false)
    setError(false)
  }

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user)
    })
    return () => unregisterAuthObserver();
  }, [])
  useEffect(() => {
    if(isSignedIn && firebase.auth && firebase.auth().currentUser) firebase.auth().currentUser.getIdTokenResult().then(token => {
      setPermissions(token.claims)
    })
    else setPermissions({})
  }, [isSignedIn])
  useEffect(() => {
    setSessionType(event.sessionType || "");
    setUserEmail(event.userEmail || "");
    setDate(event.date || "");
  },[event])

  return <Drawer {...rest} anchor="top" onClose={handleClose}>
    <Container maxWidth="sm" css={{margin:`1em auto`}}>
      <Typography variant="title" component="h3">{t('headings.eventDetails')}</Typography>
      <Stack direction="column" gap={2}>
        <fieldset disabled={!permissions['CAN_EDIT_BOOKING_DETAILS']}>
          <Stack direction="column" gap={2} marginTop={2}>
            <FormControl component="fieldset" fullWidth={true}>
              <TextField required label={t("labels.email")} value={userEmail} onChange={e => setUserEmail(e.target.value) } />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel>{t('labels.consultationType')}</FormLabel>
              <ToggleButtonGroup exclusive color="primary" value={sessionType} onChange={(_,v) => setSessionType(v)}>
                <ToggleButton value="individual">{t('labels.adult')}</ToggleButton>
                <ToggleButton value="couple">{t('labels.couple')}</ToggleButton>
                <ToggleButton value="child">{t('labels.child')}</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <FormControl>
              <DateTimePicker renderInput={props => <TextField {...props} />} label="Date" value={date} onChange={v => setDate(v) } />
            </FormControl>
          </Stack>
        </fieldset>
        <fieldset>
          {permissions['CAN_EDIT_BOOKING_DETAILS'] && <Stack direction="row" justifyContent="space-between">
            {!confirmDelete && <>
              <Stack direction="row" gap={2}>
                <Button variant="contained" onClick={() => handleUpdate(event)}>Update</Button>
                <Button variant="outlined" startIcon={<DeleteForeverIcon />} onClick={() => setConfirmDelete(true)}>Delete</Button>
              </Stack>
              <Button variant="text" onClick={handleClose}>Close</Button>
            </>}
            {confirmDelete && <>
              <Button variant="contained" startIcon={<DeleteForeverIcon/>} onClick={() => handleDelete(event.id)}>Confirm delete</Button>
              <IconButton onClick={handleCancelDelete}><CancelIcon /></IconButton>
            </>}
          </Stack>}
          {!permissions['CAN_EDIT_BOOKING_DETAILS'] && <Stack direction="row" justifyContent="space-between">
            {!confirmRefund && <>
              {/*<Button startIcon={<CurrencyExchangeIcon/>} variant="outlined" onClick={e => setConfirmRefund(true)}>Request refund</Button>*/}
              <Box></Box>
              <Button variant="text" onClick={handleClose}>Close</Button>
            </>}
            {confirmRefund && <>
              <Button startIcon={<CurrencyExchangeIcon/>} variant="contained">Confirm refund request</Button>
              <IconButton onClick={() => setConfirmRefund(false)}><CancelIcon /></IconButton>
            </>}
          </Stack>}
          {!!error && <FormHelperText error>{error}</FormHelperText>}
        </fieldset>
      </Stack>
    </Container>
  </Drawer>
}

export default Component