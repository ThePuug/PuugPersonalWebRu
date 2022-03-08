import React from 'react'
import { cx, css } from '@emotion/css'
import { Container, Drawer, FormControl, FormLabel, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/lab"
import { useTranslation } from "gatsby-plugin-react-i18next";

const Component = (props) => {
  const { t } = useTranslation('_view')
  const { event, ...rest } = props

  return <Drawer {...rest} anchor="top">
    <Container maxWidth="sm" className={cx(css`margin:1em auto`)}>
      <Typography variant="title" component="h3">{t('headings.eventDetails')}</Typography>
      <Stack direction="column" gap={2} marginTop={2}>
        <FormControl component="fieldset" fullWidth={true}>
          <TextField required label={t("labels.email")} defaultValue={event.userEmail} disabled />
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel>{t('labels.consultationType')}</FormLabel>
          <ToggleButtonGroup color="primary" value={event.sessionType} disabled>
            <ToggleButton value="individual">{t('labels.adult')}</ToggleButton>
            <ToggleButton value="couple">{t('labels.couple')}</ToggleButton>
            <ToggleButton value="child">{t('labels.child')}</ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
        <FormControl>
          <DateTimePicker renderInput={props => <TextField {...props} />} label="Date" value={event.date} onChange={() => {}} disabled/>
        </FormControl>
      </Stack>
    </Container>
  </Drawer>
}

export default Component