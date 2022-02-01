import React, { useState, useEFfect } from 'react'
import { useStoreState } from "easy-peasy";
import { Center, Box, FormControl, FormLabel, Switch, Spacer, Flex, Heading, Text } from '@chakra-ui/react';

const AboutPage = ({unsigs}) => {
  const connected = useStoreState((state) => state.connection.connected);
  // TODO
  // Use state to hold:
  // b) List offers vs list for sale --> create an UnsigOfferList view that is just like random (are we handling ability to see if a searched-for unsig is for sale in gallery view??)
  // c) current search?
  // User can toggle between seeing all unsigs and only those for sale

  return (
    <Box bg='#232129' w='100%' py='12'>
      <title>About</title>
      <Box w='85%' mx='auto'>

        <Heading size='4xl' fontWeight='medium' color='white' pb='4'>
          about unsigned_algorithms
        </Heading>
        <Flex w='40%' my='4' p='1' color='white' direction='column'>
            <Heading py='3'>Uniqueness</Heading>
            <Text py='3'>Link wallet, view collection, list</Text>
            <Heading py='3'>Original Sale & Distribution</Heading>
            <Text py='3'>Link wallet, view marketplace, search for individual unsigs or browse listings</Text>
            <Heading py='3'>Scarcity</Heading>
            <Text py='3'>Original distribution</Text>
            <Text py='3'>Community Resources</Text>
            <Heading py='3'>FAQs</Heading>
            <Text py='3'>Unsigned DAO + Gimbalabs</Text>
            <Heading py='3'>Wallet Contract Address</Heading>
            <Text py='3'><a href="https://testnet.cardanoscan.io/address/addr_test1wp8zdhctf4cmf4uuy4twnma56f8n9q4up29ayy6msnpjxqgrplfzt">addr_test1wp8zdhctf4cmf4uuy4twnma56f8n9q4up29ayy6msnpjxqgrplfzt</a></Text>
        </Flex>
      </Box>
    </Box>
  )
}

export default AboutPage
