import * as React from "react";
import { StaticImage } from "gatsby-plugin-image"

import Hero from "../components/Hero"

const headingStyles = {
  marginTop: 0,
  fontSize: "6rem",
}

const IndexPage = () => {
  return (
    <main>
      <title>Home Page</title>
      <Hero>
        <h1 style={headingStyles}>Unsigs Marketplace</h1>
        <StaticImage src="../images/01836.png" width="300" height="300" /> 
      </Hero>
    </main>
  )
}

export default IndexPage;
