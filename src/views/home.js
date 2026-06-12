'use client'
import React from "react"
import { usePathname } from "next/navigation"
import { styled } from "@mui/material/styles"
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, IconButton, Paper, Stack, Typography, List, ListItem, ListItemText } from '@mui/material'
import { Attachment, Facebook, LinkedIn } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

const Page = (props) => {
  const { t } = useTranslation("index")
  const pathname = usePathname() || '/'
  // Full-page navigation, not router.push: on repeat soft-navs to /book the client
  // router serves the cached route entry and restores its canonical URL, silently
  // dropping the changed ?for= param (staleTimes.static has a 30s floor, so the
  // cache window can't be configured away). The site is static, so a hard load is cheap.
  const navigate = (rel) => {
    const [page, query] = rel.split('?')
    const base = pathname.endsWith('/') ? pathname : pathname + '/'
    window.location.assign(`${base}${page}/${query ? '?' + query : ''}`)
  }
  return (<>
    <Nav />
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Stack direction={['column','row']} sx={{gap:2}}>
          <Card>
            <CardMedia><img src="/images/mind.jpg" alt={t('individualConsultation')} style={{ width: '100%', aspectRatio: '2 / 1', objectFit: 'cover', display: 'block' }} /></CardMedia>
            <CardContent css={{textAlign:`center`}}>
              <Typography gutterBottom variant="h5" component="h2">{t('individualConsultation')}</Typography>
              <Typography variant="subtitle1" component="h5"><strong>60 {t('minutes')}</strong></Typography>
            </CardContent>
            <CardActions css={{justifyContent:`center`}}>
              <Button variant="outlined" color="primary" onClick={() => navigate("book?for=individual")}>{t('buttons.reserve')}</Button>
            </CardActions>
          </Card>
          <Card>
            <CardMedia><img src="/images/opening.jpg" alt={t('couplesConsultation')} style={{ width: '100%', aspectRatio: '2 / 1', objectFit: 'cover', display: 'block' }} /></CardMedia>
            <CardContent css={{textAlign:`center`}}>
              <Typography gutterBottom variant="h5" component="h2">{t('couplesConsultation')}</Typography>
              <Typography variant="subtitle1" component="h5"><strong>90 {t('minutes')}</strong></Typography>
            </CardContent>
            <CardActions css={{justifyContent:`center`}}>
              <Button variant="outlined" color="primary" onClick={() => navigate("book?for=couple")}>{t('buttons.reserve')}</Button>
            </CardActions>
          </Card>
          <Card>
            <CardMedia><img src="/images/exploration.jpg" alt={t('childConsultation')} style={{ width: '100%', aspectRatio: '2 / 1', objectFit: 'cover', display: 'block' }} /></CardMedia>
            <CardContent css={{textAlign:`center`}}>
              <Typography gutterBottom variant="h5" component="h2">{t('childConsultation')}</Typography>
              <Typography variant="subtitle1" component="h5"><strong>60 {t('minutes')}</strong></Typography>
            </CardContent>
            <CardActions css={{justifyContent:`center`}}>
              <Button variant="outlined" color="primary" onClick={() => navigate("book?for=child")}>{t('buttons.reserve')}</Button>
            </CardActions>
          </Card>
        </Stack>
        <Paper css={{padding:`1rem`}}>
            <Profile elevation={4}>
              <CardHeader title={t('profile.name')} />
              <CardHeader title={t('profile.title')} />
              <CardMedia css={{textAlign:`center`}}>
                <img src="/images/profile.jpg" alt="about me" style={{ width: '100%', aspectRatio: '0.667', objectFit: 'cover', display: 'block' }} />
              </CardMedia>
              <CardActions css={{justifyContent:`center`}}>
                <IconButton href="https://www.facebook.com/artudoma" target="_blank"><Facebook fontSize="large" /></IconButton>
                <IconButton href="https://www.linkedin.com/in/rosanna-chizhova-sturgeon-2a347a1a5" target="_blank"><LinkedIn fontSize="large" /></IconButton>
                <Button fontSize="large" color="grey" variant="contained" endIcon={<Attachment />} href="https://nha.bg/uploads/ckeditor/avtoreferat_ROZANNA_CHIGOVA1.pdf" target="_blank">{t('buttons.abstract')}</Button>
              </CardActions>
            </Profile>
            <Typography variant="h6" gutterBottom>{t('headings.professionalExperience')}</Typography>
            {t('content.professionalExperience',{returnObjects:true}).map((p,i) => <Typography key={i} variant="body1" gutterBottom>{p}</Typography>)}
        </Paper>
        <Paper css={{padding:`1rem`}}>
          <Typography variant="h6" gutterBottom>{t('headings.aboutServices')}</Typography>
          {t('content.aboutServices',{returnObjects:true}).map((p,i) => <Typography key={i} variant="body1" gutterBottom>{p}</Typography>)}
          <Typography variant="h6">{t('headings.onlineServicesOffered')}</Typography>
          <Stack direction={['column','row']} sx={{gap:2}} css={{"> *": { flex:`1 0` }}}>
            {t('content.onlineServicesOffered',{returnObjects:true}).map((p,i) => <Card key={i}><CardContent><Typography variant="body1">{p}</Typography></CardContent></Card>)}
          </Stack>
        </Paper>
        <Paper css={{padding:`1rem`}}>
          <Typography variant="h6" gutterBottom>{t('headings.education')}</Typography>
          {t('content.education',{returnObjects:true}).map((p,i) => <Typography key={i} variant="body1" gutterBottom>{p}</Typography>)}
          <Typography variant="h6">{t('headings.qualifications')}</Typography>
          <List dense disablePadding>
            {t('content.qualifications',{returnObjects:true}).map((p,i) => <ListItem key={i} css={{padding:`0px`}}>
              <ListItemText><Typography variant="body1">{p}</Typography></ListItemText>
            </ListItem>)}
          </List>
        </Paper>
      </Stack>
    </Container>
    <Footer />
  </>)
}

const Profile = styled(Card)`
  float:left;
  margin:0 1rem 1rem 0;
  width:100%;
  @media screen and (min-width: 600px) {
    width:50%;
  }
`

export default Page
