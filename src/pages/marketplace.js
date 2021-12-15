import * as React from "react"
import styled from "styled-components"
import Cardano from "../cardano/serialization-lib"
import { enableWallet, getBalance, getUtxos, getOwnedAssets } from "../cardano/wallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction"
import { fromHex, toString } from "../utils/converter"
import { useStoreState } from "easy-peasy";
import { Unsig } from "../components/Unsig"
import { UnsigRandomScrollList } from "../components/UnsigRandomScrollList"

// User Journey for /offer
// 1. User can go to /offer and view all offers (separate from explore page)
// 2. User can click on offers and see the details for an asset
// - unsig nft properties
// - offer details
// User Journey for /offer/{unsig}
// 3. When a user is viewing asset details, the user can buy the asset
// - if connected wallet, buy button is active

// styles
const pageStyles = {
  color: "#232129",
  paddingTop: 40,
  paddingLeft: 96,
} 

const headingStyle = {
  fontSize: "3rem"
}

// make hooks for list and loading here too.

// then add search.

// if search, show that one
// otherwise, show random list of NUMBER

const MarketplacePage = ({unsigs}) => {
  // Build conditional rendering for when an owned unsig is on the page (how / where to check?)
  const connected = useStoreState((state) => state.connection.connected);

  // We can manipulate this list according to user input - the paginated link still plays a role

  return (
    <main style={pageStyles}>
      <title>FOR SALE</title>
      <h1 style={headingStyle}>
        The Unsig Marketplace
      </h1>
      <UnsigRandomScrollList />

    </main>
  )
}

export default MarketplacePage


