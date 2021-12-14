import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import data from "../../data/dummy-unsigs.json"
import styled from "styled-components"
import Cardano from "../cardano/serialization-lib"
import { enableWallet, getBalance, getUtxos, getOwnedAssets } from "../cardano/wallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction"
import { fromHex, toString } from "../utils/converter"

import { Unsig } from "../components/Unsig"

import { useStoreState } from "easy-peasy";
// Unsig PolicyID
const unsigID = "0e14267a8020229adc0184dd25fa3174c3f7d6caadcb4425c70e7c04";

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
}

// User Journey for /explore
// 1. User can go to /explore and view all Unsigs
// - user can filter by "offer" / "not-offered" (!MVP)
// - user can sort by price, latest/newest offers, or by unsigID (!MVP)
// - user can filter by number props (MVP)

// User Journey for /offer
// 1. User can go to /offer and view all offers (separate from explore page)
// 2. User can click on offers and see the details for an asset
// - unsig nft properties
// - offer details
// User Journey for /offer/{unsig}
// 3. When a user is viewing asset details, the user can buy the asset
// - if connected wallet, buy button is active

// User Journey for /collection
// 1. User can view the Unsigs in their connected wallet
// 2. User can see Offer status

// User Journey for /collection/create-offer
// 1. User can list an Unsig
// - This means that the owner of an Unsig can create an offer for that Unsig

const ExplorePage = ({unsigs}) => {
  const connected = useStoreState((state) => state.connection.connected);

  // still using local dummy data

  return (
    <main style={pageStyles}>
      <title>Explore</title>
      <h1>
        Explore the Collection
      </h1>
      <p>Even though we know you have wallet {connected}</p>
      <Collection>
        {data.unsigs.map((i) => (
          <Unsig 
            key={i} 
            number={Object.values(i)[0].unsigs.index} 
          />
        ))}
      </Collection>
    </main>
  )
}

export default ExplorePage



const UnsigName = styled.h2`
  font-size: 1rem;
`
const Collection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`