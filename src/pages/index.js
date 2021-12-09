import * as React from "react";
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components";

import Hero from "../components/Hero"
import Section from "../components/Section"

const headingStyles = {
  marginTop: 0,
  fontSize: "6rem",
}

const subHeadingStyles = {
  marginTop: 0,
  fontSize: "2rem",
}

const IndexPage = () => {
  return (
    <main>
      <title>Home Page</title>
      <Hero>
        <h1 style={headingStyles}>Unsigs Marketplace</h1>
        <Frame>
          <StaticImage src="../images/01836.png" width="300" height="300" alt="unsig" /> 
        </Frame>
      </Hero>
      <Section>
        <h2 style={subHeadingStyles}>learn more</h2>
      </Section>
    </main>
  )
}

export default IndexPage;

const Frame = styled.div`
  background-color: #2037d9;
  padding: 10px;
`;