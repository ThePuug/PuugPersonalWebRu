'use client'
import React, {useState} from "react"
import { Button, Container, Drawer, FormControl, FormHelperText, IconButton, Input, InputLabel, Stack, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { httpsCallable } from "firebase/functions"
import { useTranslation, Trans } from "react-i18next";
import { getUser, fns } from "@/lib/firebase";
import Loads from "./Loads"

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "1.2rem",
    }
  }
}

const Component = (props) => {
  const { booking, intent, onSuccess, onClose, ...rest } = props
  const { t } = useTranslation('_pay')
  const stripe = useStripe()
  const elements = useElements()

  const [disabled,setDisabled] = useState(true)
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)

  const handleChange = async (event) => {
    setDisabled(!event.complete || !!event.error);
    setError(!!event.error ? event.error.message : null);
  };

  const handlePay = async (intent) => {
    if (!stripe || !elements || !intent) {
      setError(`${t('errors.general')} ${t('resolvers.reload')}`)
      return;
    }
    setLoading(true)
    try {
      const confirmation = await stripe.confirmCardPayment(intent, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (confirmation.error) setError(`${t('errors.paymentFailed')} ${confirmation.error.message}. ${t('resolvers.safeToRetryPayment')}`);
      else {
        try {
          onSuccess({...(await httpsCallable(fns,'createBooking')({...booking,
            userId: getUser().uid,
            paymentReference: confirmation.paymentIntent.id,
            date: booking.date.toMillis()})).data,
            date: booking.date})
        } catch(err) {
          setError(`${t('errors.general')} ${t('resolvers.callToConfirm')}`)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return <Loads component={Drawer} {...rest} loading={loading} anchor="top">
    <Container maxWidth="sm" css={{margin:`1em auto`}}>
      <Stack sx={{gap:2}}>
          <fieldset>
          <Stack direction="column" sx={{gap:2}}>
            <FormControl margin="normal">
              <InputLabel>{t('labels.emailAddress')}</InputLabel>
              <Input readOnly value={getUser().email}></Input>
              <FormHelperText>{t('helpers.emailReceipt')}</FormHelperText>
            </FormControl>
            <FormControl margin="normal">
              <InputLabel shrink>{t('labels.cardDetails')}</InputLabel>
              <Input inputComponent={RefCardElement} onChange={handleChange}/>
              <FormHelperText error={!!error}>
                {!error && <span>{t('helpers.neverStoreDetails')}</span>}
                {!!error && <span>{error}</span>}
              </FormHelperText>
            </FormControl>
            <Typography variant="subtitle">{t('labels.amount')} {booking.sessionType === "individual" ? 40 : booking.sessionType === 'couple' ? 60 : 80} €</Typography>
          </Stack>
        </fieldset>
        <fieldset>
          <Stack direction="row" sx={{justifyContent:"stretch"}}>
            <Button
              variant="contained"
              disabled={!stripe || disabled}
              css={{flexGrow:1}}
              onClick={() => handlePay(intent)}>{t('buttons.pay')}</Button>
            <IconButton variant="text" onClick={onClose}><CancelIcon /></IconButton>
          </Stack>
          <FormHelperText>
            <Trans i18nKey="helpers.paymentProcessedBy">
              <a href="https://stripe.com/about" target="_blank" rel="noreferrer"></a>
            </Trans>
          </FormHelperText>
        </fieldset>
      </Stack>
    </Container>
  </Loads>
}

const RefCardElement = React.forwardRef((props,ref) => {
  const { onChange, ...rest } = props
  return <div {...rest} ref={ref}>
    <CardElement options={CARD_OPTIONS} onChange={onChange}/>
  </div>
})

export default Component
