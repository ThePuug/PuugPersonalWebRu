'use client'
import React from "react"
import { usePathname } from "next/navigation"
import { styled } from "@mui/material/styles"
import { Box, Button, Card, CardActions, CardContent, Container, IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { Attachment, Facebook, LinkedIn } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

// brand crayon-stroke colors used as small accents (the design "ink" is periwinkle).
// Service-card chips deliberately avoid teal/blue/orange/red — those are reserved for
// the calendar's slot-state semantics (free/booked/mine/active) in book.js.
const PERI = '#5B4BC4', PERI_LIGHT = '#907df9', PINK = '#f97dd9', LILAC = '#c77ee0',
  TEAL = '#6cf4d5', BLUE = '#6cd2f4', YELLOW = '#f9ee7a', CORAL = '#f97d7d'

// staggered page-load entrance; collapses to an instant reveal under prefers-reduced-motion
// (the global rule in theme.js zeroes animation duration + delay)
const reveal = (delay = 0) => ({ animation: 'appear .6s ease-out both', animationDelay: `${delay}ms` })

// four-point sparkle lifted from her paintings — the connective accent
const Star = ({ color = PERI, size = 16, twinkle = false, sx }) => (
  <Box component="span" aria-hidden sx={{ display: 'inline-flex', flex: '0 0 auto', lineHeight: 0,
    ...(twinkle ? { animation: 'twinkle 3.2s ease-in-out infinite' } : {}), ...sx }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 1c.9 6.2 1.7 8 5 9.4 3.3 1.4 4.7 1.9 6 1.6-1.3-.3-2.7.2-6 1.6-3.3 1.4-4.1 3.2-5 9.4-.9-6.2-1.7-8-5-9.4C7.7 12.8 6.3 12.3 5 12.6c1.3.3 2.7-.2 6-1.6 3.3-1.4 4.1-3.2 5-9.4Z" />
    </svg>
  </Box>
)

// hand-drawn coral wave echoing the logo's ground line — sparse section divider
const CoralDivider = (props) => (
  <Box aria-hidden {...props} sx={{ color: CORAL, lineHeight: 0, ...props.sx }}>
    <svg viewBox="0 0 1200 16" width="100%" height="11" fill="none" preserveAspectRatio="none">
      <path d="M0 8 Q60 1 120 8 T240 8 T360 8 T480 8 T600 8 T720 8 T840 8 T960 8 T1080 8 T1200 8"
        stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </Box>
)

const SectionHeading = ({ children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
    <Star size={16} color={PERI} />
    <Typography variant="h6" component="h2" sx={{ m: 0 }}>{children}</Typography>
  </Box>
)

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

  const services = [
    { for: 'individual', img: 'mind.jpg', title: t('individualConsultation'), mins: 60, chip: PINK },
    { for: 'couple', img: 'opening.jpg', title: t('couplesConsultation'), mins: 90, chip: LILAC },
    { for: 'child', img: 'exploration.jpg', title: t('childConsultation'), mins: 60, chip: YELLOW },
  ]

  return (<>
    <Nav />
    <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
      <Stack spacing={{ xs: 5, md: 8 }} sx={{ py: { xs: 3, md: 5 } }}>

        {/* booking services — three paintings hung as a row, stacked on mobile */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          {services.map((s, i) => (
            <ServiceCard key={s.for} sx={reveal(i * 90)}>
              <Box sx={{ p: 1, pb: 0 }}>
                <Box component="img" src={`/images/${s.img}`} alt={s.title}
                  sx={{ width: '100%', display: 'block', aspectRatio: '2 / 1', objectFit: 'cover',
                    borderRadius: '10px', border: '1px solid rgba(91,75,196,0.22)' }} />
              </Box>
              <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box aria-hidden sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: s.chip, border: '1px solid rgba(91,75,196,0.5)' }} />
                  <Typography variant="h5" component="h2">{s.title}</Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>{s.mins} {t('minutes')}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button variant="outlined" sx={{ borderRadius: 999, px: 3 }} onClick={() => navigate(`book?for=${s.for}`)}>{t('buttons.reserve')}</Button>
              </CardActions>
            </ServiceCard>
          ))}
        </Box>

        {/* hero / profile — stacked on mobile, asymmetric two-column on md+ */}
        <Box component="section">
          <Hero>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, ...reveal(40) }}>
                <Star size={14} color={PINK} />
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>{t('profile.eyebrow')}</Typography>
              </Box>
              <HeroName variant="h1" sx={reveal(80)}>{t('profile.name')}</HeroName>
              <Stack spacing={0.5} sx={{ mt: 2.5 }}>
                {t('profile.title', { returnObjects: true }).map((line, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'baseline', gap: 1, ...reveal(160 + i * 70) }}>
                    <Star size={13} color={[PERI, PINK, TEAL][i % 3]} sx={{ transform: 'translateY(2px)' }} />
                    <Typography sx={{ fontStyle: 'italic', color: 'text.secondary', fontSize: { xs: '1rem', md: '1.05rem' } }}>{line}</Typography>
                  </Box>
                ))}
              </Stack>
              <Stack direction="row" spacing={1.25} sx={{ mt: 3, alignItems: 'center', flexWrap: 'wrap', gap: 1, ...reveal(360) }}>
                <IconButton href="https://www.facebook.com/artudoma" target="_blank" aria-label="Facebook"
                  sx={{ border: '1.5px solid', borderColor: 'primary.main', '&:hover': { bgcolor: 'rgba(199,126,224,0.16)' } }}><Facebook /></IconButton>
                <IconButton href="https://www.linkedin.com/in/rosanna-chizhova-sturgeon-2a347a1a5" target="_blank" aria-label="LinkedIn"
                  sx={{ border: '1.5px solid', borderColor: 'primary.main', '&:hover': { bgcolor: 'rgba(199,126,224,0.16)' } }}><LinkedIn /></IconButton>
                <Button variant="outlined" endIcon={<Attachment />} sx={{ borderRadius: 999 }}
                  href="https://nha.bg/uploads/ckeditor/avtoreferat_ROZANNA_CHIGOVA1.pdf" target="_blank">{t('buttons.abstract')}</Button>
              </Stack>
            </Box>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: { xs: 300, md: 'none' }, mx: 'auto', ...reveal(260) }}>
              <Box component="img" src="/images/profile.jpg" alt={t('profile.name')}
                sx={{ width: '100%', display: 'block', aspectRatio: '0.72', objectFit: 'cover',
                  borderRadius: '32px 44px 34px 46px', border: `2px solid ${PERI}`,
                  boxShadow: '0 22px 44px -24px rgba(43,36,64,0.55)' }} />
              <Star size={28} color={YELLOW} twinkle sx={{ position: 'absolute', top: -12, left: -8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.18))' }} />
              <Star size={16} color={PINK} sx={{ position: 'absolute', bottom: 18, right: -6 }} />
            </Box>
          </Hero>

          <Box sx={{ maxWidth: { md: '68ch' }, mt: { xs: 4, md: 6 } }}>
            <SectionHeading>{t('headings.professionalExperience')}</SectionHeading>
            {t('content.professionalExperience', { returnObjects: true }).map((p, i) =>
              <Typography key={i} paragraph sx={{ lineHeight: 1.75 }}>{p}</Typography>)}
          </Box>
        </Box>

        <CoralDivider />

        {/* about the services */}
        <Box component="section">
          <Box sx={{ maxWidth: { md: '68ch' } }}>
            <SectionHeading>{t('headings.aboutServices')}</SectionHeading>
            {t('content.aboutServices', { returnObjects: true }).map((p, i) =>
              <Typography key={i} paragraph sx={{ lineHeight: 1.75 }}>{p}</Typography>)}
          </Box>
          <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 2 }}>{t('headings.onlineServicesOffered')}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {t('content.onlineServicesOffered', { returnObjects: true }).map((p, i) => (
              <Card key={i} sx={{ p: 1, ...reveal(i * 80) }}>
                <CardContent>
                  <Star size={15} color={[TEAL, PINK, BLUE][i % 3]} sx={{ mb: 1 }} />
                  <Typography sx={{ lineHeight: 1.7 }}>{p}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        <CoralDivider />

        {/* education + qualifications */}
        <Box component="section" sx={{ maxWidth: { md: '72ch' } }}>
          <SectionHeading>{t('headings.education')}</SectionHeading>
          {t('content.education', { returnObjects: true }).map((p, i) =>
            <Typography key={i} paragraph sx={{ lineHeight: 1.75 }}>{p}</Typography>)}
          <Typography variant="h6" component="h3" sx={{ mt: 4, mb: 1.5 }}>{t('headings.qualifications')}</Typography>
          <List dense disablePadding>
            {t('content.qualifications', { returnObjects: true }).map((p, i) => (
              <ListItem key={i} sx={{ px: 0, py: 0.35, alignItems: 'baseline', gap: 1.25 }}>
                <Box aria-hidden sx={{ flex: '0 0 auto', width: 6, height: 6, mt: '0.55em', borderRadius: '1px', bgcolor: PERI }} />
                <ListItemText sx={{ m: 0 }}><Typography variant="body1">{p}</Typography></ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>

      </Stack>
    </Container>
    <Footer />
  </>)
}

const Hero = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: theme.spacing(6),
  },
}))

const HeroName = styled(Typography)(({ theme }) => ({
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontWeight: 600,
  color: theme.palette.primary.main,
  lineHeight: 1.06,
  fontSize: 'clamp(2.1rem, 6vw, 3.4rem)',
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: '-0.16em',
    height: 6,
    width: '44%',
    background: theme.palette.primary.light,
    borderRadius: 6,
    transformOrigin: 'left',
    animation: 'underdraw .7s .5s ease-out both',
  },
}))

const ServiceCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 16,
  transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 34px -18px rgba(91,75,196,0.5)',
    borderColor: 'rgba(91,75,196,0.4)',
  },
}))

export default Page
