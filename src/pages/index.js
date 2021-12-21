import React, { useEffect, useState } from "react";
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components";
import { useStoreState } from "easy-peasy";

import Hero from "../components/Hero"
import Section from "../components/Section"
import { getBalance } from "../cardano/wallet";
import { fromAscii, fromHex } from "../utils/converter";

const IndexPage = () => {
  const connected = useStoreState((state) => state.connection.connected);
  const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);
  const ownedUtxos = useStoreState((state) => state.ownedUtxos.utxos)
  const [ walletFunds, setWalletFunds ] = useState(null);

  useEffect(async () => {
    if (connected) {
      const amt = await getBalance();
      setWalletFunds(amt);
      console.log(amt)
    }
  }, [])

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
        <p>{walletFunds}</p>
        <p>put some basic instructions here, "you must connect a Nami wallet to use the marketplace..."</p>
      </Section>
    </main>
  )
}

export default IndexPage;

const Frame = styled.div`
  background-color: #232129;
  padding: 10px;
`;