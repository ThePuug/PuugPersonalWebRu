import React from "react"
import TopLayout from "./src/components/TopLayout"

export const wrapPageElement = ({element, props}) => (
  <TopLayout {...props}>{element}</TopLayout>
)
