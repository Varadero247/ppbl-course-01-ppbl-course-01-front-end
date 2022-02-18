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
      <title>ppbl demo</title>
      <Flex w='100%' mx='auto' direction='column' wrap='wrap' bg='gl-yellow'>
          <Box w='50%' mx='auto' my='5'>
            <Heading size='xl' color='gl-blue' fontWeight='medium'>Welcome to Plutus Project Based Learning!</Heading>
            <Text fontSize='lg' py='3'>
              To connect to your Nami wallet on Cardano Testnet, click "Connect Wallet" button.
            </Text>
            <Text fontSize='lg'>
              After your wallet is connected, you can click "View PPBL Dapp" and see what is there.
            </Text>
          </Box>
      </Flex>
    </>
  )
}

export default IndexPage;
