import React from "react"
import TopLayout from "./src/components/TopLayout"

import firebase from "gatsby-plugin-firebase"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"

if(window.location.hostname === "localhost") {
  firebase.auth().useEmulator('http://localhost:9099')
  firebase.firestore().useEmulator('localhost', 8080)
  firebase.app().functions("europe-central2").useEmulator('localhost', 5001)
}

export const wrapPageElement = ({element, props}) => (<>
  <TopLayout {...props}>{element}</TopLayout>
</>)
