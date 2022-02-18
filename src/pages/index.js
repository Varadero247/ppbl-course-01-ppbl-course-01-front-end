import React, { useEffect, useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import Wallet from "../cardano/wallet";
import { fromAscii, fromHex } from "../utils/converter";
import { Flex, Center, Heading, Text, Box } from "@chakra-ui/react";

const IndexPage = () => {
  const connected = useStoreState((state) => state.connection.connected);
  const [ walletFunds, setWalletFunds ] = useState(null);
  const [ walletUtxos, setWalletUtxos ] = useState(null)

  useEffect(async () => {
    if (connected) {
      await Wallet.enable();
      const amt = await Wallet.getBalance();
      setWalletFunds(amt);
      console.log(amt)
    }
  }, [])

  useEffect(async () => {
    if (connected) {
      await Wallet.enable();
      const amt = await Wallet.getUtxos();
      setWalletUtxos(amt);
      console.log(amt)
    }
  }, [])

  return (
    <>
      <title>demo v0</title>
      <Flex w='100%' mx='auto' direction='column' wrap='wrap' bg='gl-yellow'>
          <Heading size='4xl' color='gl-blue' fontWeight='medium'>jukebox demo</Heading>
          <Box w='50%'>
            <Heading>Balance</Heading>
            <Text>{walletFunds}</Text>
            <Heading>Utxos</Heading>
            <Text>{walletUtxos}</Text>
          </Box>
      </Flex>
    </>
  )
}

export default IndexPage;
