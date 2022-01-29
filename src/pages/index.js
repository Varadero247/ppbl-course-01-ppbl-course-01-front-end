import React, { useEffect, useState } from "react";
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components";
import { useStoreState } from "easy-peasy";

import Section from "../components/Section"
import Wallet from "../cardano/wallet";
import { fromAscii, fromHex } from "../utils/converter";
import { Center, Heading, Text } from "@chakra-ui/react";

const IndexPage = () => {
  const connected = useStoreState((state) => state.connection.connected);
  const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);
  const ownedUtxos = useStoreState((state) => state.ownedUtxos.utxos)
  const [ walletFunds, setWalletFunds ] = useState(null);

  useEffect(async () => {
    if (connected) {
      await Wallet.enable();
      const amt = await Wallet.getBalance();
      setWalletFunds(amt);
      console.log(amt)
    }
  }, [])

  return (
    <main>
      <title>Welcome</title>
      <Center w='100%' h='800px' bg='#232129'>
        <Heading size='4xl' color='white' fontWeight='medium'>Unsigs Marketplace</Heading>
      </Center>
    </main>
  )
}

export default IndexPage;
