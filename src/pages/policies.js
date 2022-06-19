import React from "react"
import { graphql } from "gatsby"
import { Container, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from "gatsby-plugin-react-i18next"
import Nav from "../components/Nav"
import Footer from "../components/Footer"

const Page = (props) => {
  const { t } = useTranslation("policies")
  return (<>
    <Nav />
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Paper css={{padding:`1rem`}}>
          <Typography variant="h4">{t('privacyPolicy')}</Typography>
          <Typography variant="body1"><em>Last updated: June 19, 2022</em></Typography>
          <Typography variant="body1" paragraph>We value your privacy, and with this page, we want to clearly communicate what data we collect and how we use it and also inform you of your rights to privacy while using artudoma.com site.</Typography>
          <Typography variant="h5">Using Your Personal Data</Typography>
          <Typography variant="body1" paragraph>We aim to collect as little data as possible while still providing our service. In order to provide a platform that is robust, secure, and easy-to-use, we may use collected data in the following ways:
            <ul>
              <li>To provide and maintain our service, including analysis of how the site is used</li>
              <li>To manage your account, before and after registration</li>
              <li>To book appointments and associate them with your account</li>
              <li>To contact you regarding your appointments</li>
              <li>To provide you with news and special offers about our services.</li>
            </ul>
          </Typography>
          <Typography variant="body1" paragraph>We will never sell your data. We will only use the data collected to serve you better.</Typography>
          <Typography variant="h5">Types of Data Collected</Typography>
          <Typography variant="h6">Personal Data</Typography>
          <Typography variant="body1" paragraph>When you book an appointment we store the following information on our servers in order to more easily contact you regarding updates associated with the booking: Email address</Typography>
          <Typography variant="h6">Usage Data</Typography>
          <Typography variant="body1" paragraph>Usage Data is collected automatically when using the Service via google analytics. We are not able to, nor do we desire to connect individual usage with personally identifiable accounts. This anonymous data is only used to help ensure the services being provided are working as intended.</Typography>
          <Typography variant="body1" paragraph>Usage Data may include the following: Your Device's IP address, browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</Typography>
          <Typography variant="body1" paragraph>We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.</Typography>
          <Typography variant="h6">Information from Third-Party Social Media Services</Typography>
          <Typography variant="body1" paragraph>Our site allows you to create an account and log in through the following Third-party Social Media Services: Facebook, Google</Typography>
          <Typography variant="body1" paragraph>When you login to your account through one of our 3rd party providers, we request the following data: Email address, first and last name, public profile image.</Typography>
          <Typography variant="body1" paragraph>This data is used only while you are on the site and is not stored on our servers.</Typography>
          <Typography variant="h5">Tracking Technologies and Cookies</Typography>
          <Typography variant="body1" paragraph>We do not use cookies, tags, scripts, beacons, or other technologies to track your usage of the service. However, we do use cookies in a limited capacity for essential function of the site and to comply with regulations, as described below.</Typography>
          <Typography variant="body1" paragraph>3rd party providers may store logged in state temporarily (via cookies or session data) in order to allow you to stay logged in across return visits to the site.</Typography>
          <Typography variant="body1" paragraph>When booking we temporarily store session data related the choices you selected such as date and type of booking so that we can pass them along to our 3rd party payments provider, Stripe.</Typography>
          <Typography variant="h5">Retention of Your Personal Data</Typography>
          <Typography variant="body1" paragraph>We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, including prior services purchased.</Typography>
          <Typography variant="h5">Transfer of Your Personal Data</Typography>
          <Typography variant="body1" paragraph>We collect data only through 3rd parties, such as google, in order to ensure your data is treated securely and in accordance with this privacy policy. These 3rd parties may store that data on servers located outside your jurisdiction.</Typography>
          <Typography variant="h5">Disclosure of Your Personal Data</Typography>
          <Typography variant="body1" paragraph>We will never sell your data. We will never disclose your data except to serve you better.</Typography>
          <Typography variant="body1" paragraph>Under certain circumstances, we may be required to disclose your personal data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</Typography>
          <Typography variant="h5">Security of Your Personal Data</Typography>
          <Typography variant="body1" paragraph>The security of Your Personal Data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your personal data, we cannot guarantee its absolute security.</Typography>
          <Typography variant="h5">Children's Privacy</Typography>
          <Typography variant="body1" paragraph>Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, we take steps to remove that information from Our servers.</Typography>
          <Typography variant="h5">Links to Other Websites</Typography>
          <Typography variant="body1" paragraph>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</Typography>
          <Typography variant="h5">Changes to this Privacy Policy</Typography>
          <Typography variant="body1" paragraph>We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page and update the "Last updated" date at the top of this Privacy Policy.</Typography>
          <Typography variant="body1" paragraph>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</Typography>
          <Typography variant="h5">Contact Us</Typography>
          <Typography variant="body1" paragraph>If you have any questions about this Privacy Policy, You can contact us by email at admin@artudoma.com</Typography>
        </Paper>
        <Paper css={{padding:`1rem`}}>
          <Typography variant="title" component="h4">{t('termsOfService')}</Typography>
          <Typography variant="body1">We protect your data to the best of our ability, and you accept the risks associated with using the site.</Typography>
        </Paper>
      </Stack>
    </Container>
    <Footer />
  </>)
}

export default Page

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;