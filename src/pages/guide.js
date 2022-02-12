import React, { useState, useEFfect } from 'react'
import { useStoreState } from "easy-peasy";
import {
  Center,
  Box,
  FormControl,
  FormLabel,
  Switch,
  Spacer,
  Flex,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';

const GuidePage = ({unsigs}) => {
  const connected = useStoreState((state) => state.connection.connected);
  // TODO
  // Use state to hold:
  // b) List offers vs list for sale --> create an UnsigOfferList view that is just like random (are we handling ability to see if a searched-for unsig is for sale in gallery view??)
  // c) current search?
  // User can toggle between seeing all unsigs and only those for sale

  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  }

  return (
    <Box bg='#232129' w='100%' py='6'>
      <title>guide</title>
      <Box w='85%' mx='auto' minH='60vh' >

        <Heading size='4xl' fontWeight='medium' color='white' pb='10'>
          marketplace_guide
        </Heading>

        <Flex w='100%' color='white' direction='column'>
          <Tabs orientation='vertical'>
            <TabList mr='10' >
              <Tab py='10' _selected={{ color: 'black', bg: 'white' }}>connect a wallet</Tab>
              <Tab py='10' _selected={{ color: 'black', bg: 'white' }}>selling unsigs</Tab>
              <Tab py='10' _selected={{ color: 'black', bg: 'white' }}>buying unsigs</Tab>
              <Tab py='10' _selected={{ color: 'black', bg: 'white' }}>fees</Tab>
              <Tab py='10' _selected={{ color: 'black', bg: 'white' }}>get involved</Tab>

            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading py='3'>connect a wallet</Heading>
                <Text py='3'>
                  To interact with this marketplace, you must connect a Nami, CCVault or Flint Wallet.
                </Text>
                <Text py='3'>
                  Please install one of these wallets, and then click the "connect wallet" button, top right.
                </Text>
              </TabPanel>
              <TabPanel>
                <Heading py='3'>how to sell your unsigs</Heading>
                <Text py='3'>If there are unsigs in your connected wallet, you can list them for sale.</Text>
                <Text py='3'>To view your collection, click the "my collection" button, then choose the unsig you would like to offer.</Text>
                <Text py='3'>From the unique unsig page, you can create a new offer.</Text>
                <Text py='3'>If an unsig is already listed, you can change or cancel your offer.</Text>
                <Text py='3'>For easy sharing, every unsig has a dedicated URL.</Text>
              </TabPanel>
              <TabPanel>
                <Heading py='3'>how to buy unsigs</Heading>
                <Text py='3'>If there is sufficient ada in your connected wallet, you can buy unsigs in the marketplace.</Text>
                <Text py='3'>First you must set collateral, or otherwise make sure that there is a collateral utxo in your connected wallet.</Text>
                <Text py='3'>You can browse unsigs by navigating to marketplace or the home page of this site.</Text>
                <Text py='3'>If an unsig is listed for sale, you can buy it by navigating to its unique unsig page.</Text>
              </TabPanel>
              <TabPanel>
                <Heading py='3'>marketplace fees</Heading>
                <Text py='3'>1.25% for unsigned_dao</Text>
                <Text py='3'>1.25% for the artist</Text>
              </TabPanel>
              <TabPanel>
                <Heading py='3'>get involved</Heading>
                <Text py='3'>Unsigned DAO + Gimbalabs</Text>
                <Text py='3'>Gimbalabs is a community of learners and builders. This marketplace was built by the Plutus Project-Based Learning team at Gimbalabs, November 2021 - February 2022. To learn more about Gimbalabs, visit <a href="https://gimbalabs.com">gimbalabs.com</a></Text>

              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </Box>
  )
}

export default GuidePage