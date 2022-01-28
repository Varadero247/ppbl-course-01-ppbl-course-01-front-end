import React, { useState, useEFfect } from 'react'
import { useStoreState } from "easy-peasy";
import { Center, Box, FormControl, FormLabel, Switch, Spacer, Flex, Heading, Text } from '@chakra-ui/react';

const GuidePage = ({unsigs}) => {
  const connected = useStoreState((state) => state.connection.connected);
  // TODO
  // Use state to hold:
  // b) List offers vs list for sale --> create an UnsigOfferList view that is just like random (are we handling ability to see if a searched-for unsig is for sale in gallery view??)
  // c) current search?
  // User can toggle between seeing all unsigs and only those for sale

  return (
    <Box bg='#232129' w='100%' py='12'>
      <title>Guide</title>
      <Box w='85%' mx='auto'>

        <Heading size='4xl' fontWeight='medium' color='white'>
          Marketplace Guide
        </Heading>
        <Flex w='40%' my='4' p='1' color='white' direction='column'>
            <Heading py='3'>How to Sell Unsigs</Heading>
            <Text py='3'>Link wallet, view collection, list</Text>
            <Heading py='3'>How to Buy Unsigs</Heading>
            <Text py='3'>Link wallet, view marketplace, search for individual unsigs or browse listings</Text>
            <Heading py='3'>Fees</Heading>
            <Text py='3'>1.25% and 1.25%</Text>
            <Heading py='3'>Get Involved</Heading>
            <Text py='3'>Unsigned DAO + Gimbalabs</Text>

        </Flex>
      </Box>
    </Box>
  )
}

export default GuidePage