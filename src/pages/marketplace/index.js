import React, { useState, useEFfect } from 'react'
import Cardano from "../../cardano/serialization-lib"
import { serializeTxUnspentOutput, valueToAssets } from "../../cardano/transaction"
import { useStoreState } from "easy-peasy";
import { Unsig } from "../../components/Unsig"
import { UnsigRandomScrollList } from "../../components/UnsigRandomScrollList"
import { UnsigOrderedScrollList} from "../../components/UnsigOrderedScrollList"

import { Center, Box, FormControl, FormLabel, Switch, Spacer, Flex } from '@chakra-ui/react';
import UnsigOfferScrollList from '../../components/UnsigOfferScrollList/UnsigOfferScrollList';

// styles
const pageStyles = {
  backgroundColor: "#232129",
  paddingTop: 40,
  paddingLeft: 96,
}

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
    <main style={pageStyles}>
      <title>FOR SALE</title>
      <h1>
        The Unsig Marketplace
      </h1>
      <Center w='25%' h='70px' ml='20px' bg='#444' color='white'>

        <FormControl padding='4'>
          <FormLabel>
            Search Unsigs
          </FormLabel>
          <Switch id='set-search' onChange={handleSearchChange} />

        </FormControl>
        <FormControl padding='4'>

          <FormLabel>
            View Offers Only
          </FormLabel>
          <Switch id='set-view-offers' onChange={handleViewOffersChange} />
        </FormControl>
      </Center>
      <Flex w='95%' direction='column'>
        {viewOffers ?
          (<UnsigOfferScrollList />) :  (<UnsigRandomScrollList />)
        }
      </Flex>


    </main>
  )
}

export default MarketplacePage
