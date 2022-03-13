require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: "Regain Us",
  },
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-image",
    "gatsby-plugin-material-ui",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        feature: {
          auth:true
        },
        credentials: {
          apiKey: process.env.GATSBY_FIREBASE_API_KEY,
          authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
          // databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
          projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
          // storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
          // messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
          // appId: process.env.GATSBY_FIREBASE_APP_ID,
        }
      }
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        languages: ['bg','en'],
        defaultLanguage: 'bg',
        fallbackLanguage: 'bg',
        redirect: false,
        siteUrl: 'https://artudoma.com/',
        generateDefaultLanguagePage: true,
        i18nextOptions: {
          interpolation: { escapeValue: false }
        },
        pages: [
          {
            matchPath: '/pages',
            languages: ['bg','en']
          }
        ]
      }
    },
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "locale",
        path: "./locales/",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
