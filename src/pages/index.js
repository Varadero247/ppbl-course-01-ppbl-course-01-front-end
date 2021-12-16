import * as React from "react";
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components";
import { useStoreState } from "easy-peasy";

import Hero from "../components/Hero"
import Section from "../components/Section"

const IndexPage = () => {
  const connected = useStoreState((state) => state.connection.connected);
  const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);
  return (
    <main>
      <title>Home Page</title>
      <Hero>
        <h1>Unsigs Marketplace</h1>
        <Frame>
          <StaticImage src="../images/01836.png" width="300" height="300" alt="unsig" /> 
        </Frame>
      </Hero>
      <Section>
        <h2>learn more, {connected}</h2>
        <p>You own {ownedUnsigs.join()}</p>
      </Section>
    </main>
  )
}

export default IndexPage;

const Frame = styled.div`
  background-color: #2037d9;
  padding: 10px;
`;