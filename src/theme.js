import { createTheme } from "@mui/material/styles"
import { blueGrey, lightBlue, lightGreen } from "@mui/material/colors"

// "Atelier" — a warm-paper art-gallery system built around Dr. Chizhova-Sturgeon's
// own crayon house-logo and linocut paintings. Periwinkle (her painting "ink") is
// promoted to the structural color; the seven brand pastels are rationed to small
// accents. All contrast ratios verified WCAG AA (see commit notes).
//
// NOTE: the named brand keys (yellow/pink/teal/blue/purple/orange/red + slot tokens)
// are READ BY NAME in book.js (calendar slot states), Nav.js, and Footer.js — they
// survive untouched; primary/secondary/background/text/grey are layered on top.

// Brand stroke colors (the seven crayon strokes of the house logo)
const brand = {
  yellow: '#f9ee7a',
  pink:   '#f97dd9',
  teal:   '#6cf4d5',
  blue:   '#6cd2f4',
  purple: '#907df9', // periwinkle "ink" outline
  orange: '#f9ab79',
  red:    '#f97d7d',
  lilac:  '#c77ee0',
}

// Working, AA-safe derivations
const ink       = '#2B2440' // body text — 13.8:1 on paper
const inkMuted  = '#6B6480' // secondary text — 5.2:1 on paper
const periwinkle = '#5B4BC4' // primary (deepened from brand purple) — 6.05:1 on paper
const heartPink  = '#B83C7E' // secondary (deepened from brand pink) — AA as text (price)
const paper     = '#FBF7F0'
const surface   = '#FFFFFF'

// Faint crayon-paper grain baked at low alpha so flat fills read as stock, not screen-white
const grain = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")"

const theme = createTheme({
  palette: {
    primary:   { main: periwinkle, light: brand.purple, contrastText: '#FFFFFF' },
    secondary: { main: heartPink, contrastText: '#FFFFFF' },
    background: { default: paper, paper: surface },
    text: { primary: ink, secondary: inkMuted },
    // grey is deep-merged over MUI's 50–900 scale: adds main/contrastText so the
    // home abstract button's color="grey" resolves, without losing the grey scale.
    grey: { main: '#6B6478', contrastText: '#FFFFFF' },

    // ---- named brand tokens (read by name elsewhere — do not remove) ----
    freeSlot: { main: lightBlue[50] },
    mySlot: { main: lightGreen[500] },
    bookedSlot: { main: blueGrey[300] },
    yellow: { main: brand.yellow },
    pink: { main: brand.pink },
    teal: { main: brand.teal },
    blue: { main: brand.blue },
    purple: { main: brand.purple },
    orange: { main: brand.orange },
    red: { main: brand.red },
    lilac: { main: brand.lilac },
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: 'var(--font-lora), Georgia, "Times New Roman", serif',
    h1: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.01em' },
    h2: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.01em' },
    h3: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, lineHeight: 1.12 },
    h4: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, lineHeight: 1.15 },
    h5: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, lineHeight: 1.2 },
    h6: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, lineHeight: 1.25, letterSpacing: '0.005em' },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    overline: { fontWeight: 600, letterSpacing: '0.16em', lineHeight: 1.6 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: paper,
          backgroundImage: grain,
          color: ink,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': { backgroundColor: 'rgba(144,125,249,0.28)' },
        // shared entrance animation; collapses to a plain fade under reduced-motion
        '@keyframes appear': {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to: { opacity: 1, transform: 'none' },
        },
        '@keyframes underdraw': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        '@keyframes twinkle': {
          '0%,100%': { opacity: 0.55, transform: 'scale(0.92)' },
          '50%': { opacity: 1, transform: 'scale(1)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animationDuration: '0.001ms !important',
            animationDelay: '0.001ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.001ms !important',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          paddingInline: 20,
          paddingBlock: 7,
          boxShadow: 'none',
          transition: 'background-color .2s ease, color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease',
        },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
        containedPrimary: {
          '&:hover': { boxShadow: '0 8px 20px -8px rgba(91,75,196,0.55)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: surface,
          backgroundImage: 'none',
          border: '1px solid rgba(91,75,196,0.16)',
          boxShadow: 'none',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: { title: { fontFamily: 'var(--font-playfair), Georgia, serif' } },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: periwinkle,
          transition: 'background-color .2s ease, color .2s ease, transform .2s ease',
        },
      },
    },
    MuiLink: {
      styleOverrides: { root: { color: periwinkle, textUnderlineOffset: '3px' } },
    },
  },
})

export default theme
