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
  // TODO
  // Use state to hold:
  // b) List offers vs list for sale --> create an UnsigOfferList view that is just like random (are we handling ability to see if a searched-for unsig is for sale in gallery view??)
  // c) current search?
  // User can toggle between seeing all unsigs and only those for sale

  const [search, setSearch] = useState(false)
  const [viewOffers, setViewOffers] = useState(false)

  const handleSearchChange = () => {
    setSearch(!search)
  }

  const handleViewOffersChange = () => {
    setViewOffers(!viewOffers)
    console.log("hit me with " + viewOffers)
  }

  return (
    <Box bg='#232129' w='100%' py='12'>
      <title>FOR SALE</title>
      <Box w='85%' mx='auto'>

        <Heading size='4xl' fontWeight='medium' color='white'>
          The Unsig Marketplace
        </Heading>
        <Flex w='40%' my='4' p='1' color='white' direction='row'>

          <FormControl padding='4'>
            <FormLabel fontSize='xl'>
              Search All Unsigs
            </FormLabel>
            <Switch id='set-search' onChange={handleSearchChange} />
          </FormControl>
          {/* IF SEARCH THEN motion ui the SEARCH BOX in, OTHERWISE YOU GET THE VIEW OFFERS TOGGLE */}
          {search ? "" :
            (
              <FormControl padding='4'>
                <FormLabel fontSize='xl'>
                  View Offers Only
                </FormLabel>
                <Switch id='set-view-offers' onChange={handleViewOffersChange} />
              </FormControl>
            )
          }
        </Flex>
        <Flex direction='column'>
          {search ?
            (<UnsigOrderedScrollList />) : (
              <>
                {viewOffers ?
                  (<UnsigOfferScrollList />) :  (<UnsigRandomScrollList />)
                }
              </>
            )
          }
        </Flex>
      </Box>
    </Box>
  )
}

export default MarketplacePage
