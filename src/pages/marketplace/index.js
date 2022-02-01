import React, { useState, useEFfect } from 'react'
import Cardano from "../../cardano/serialization-lib"
import { serializeTxUnspentOutput, valueToAssets } from "../../cardano/transaction"
import { useStoreState } from "easy-peasy";
import { Unsig } from "../../components/Unsig"
import { UnsigRandomScrollList } from "../../components/UnsigRandomScrollList"
import { UnsigOrderedScrollList} from "../../components/UnsigOrderedScrollList"

import { Center, Box, FormControl, FormLabel, Switch, Spacer, Flex, Heading } from '@chakra-ui/react';
import UnsigOfferScrollList from '../../components/UnsigOfferScrollList/UnsigOfferScrollList';

const MarketplacePage = ({unsigs}) => {
  const connected = useStoreState((state) => state.connection.connected);

  const [viewSearch, setViewSearch] = useState(false)

  const handleSearchChange = () => {
    setViewSearch(!viewSearch)
  }

  const currentView = () => {
    if(viewSearch) return "search unsigs"
    return "view all current offers"
  }



  return (
    <Box bg='#232129' w='100%' py='12'>
      <title>marketplace</title>
      <Center w='50%' mx='auto'>
        <Heading size='4xl' fontWeight='medium' color='white'>
          unsigned_marketplace
        </Heading>
      </Center>
      <FormControl w='5%' mx='auto' my='10'>
        <Switch id='set-search' onChange={handleSearchChange} />
      </FormControl>
      <Center>
        <Heading size='2xl' fontWeight='medium' color='white'>
          {currentView()}
        </Heading>
      </Center>
      <Flex direction='column' pt='5'>
        {viewSearch ?
          (<UnsigOrderedScrollList />) : (<UnsigOfferScrollList />)
        }
      </Flex>
    </Box>
  )
}

export default MarketplacePage
