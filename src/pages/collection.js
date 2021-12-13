import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import data from "../../data/dummy-unsigs.json"
import styled from "styled-components"
import Cardano from "../cardano/serialization-lib"
import { enableWallet, getBalance, getUtxos, getOwnedAssets } from "../cardano/wallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction"
import { fromHex, toString } from "../utils/converter"
import { useStoreState } from "easy-peasy";

// styles
const pageStyles = {
  color: "#232129",
  padding: 96
}

// User Journey for /collection
// 1. User can view the Unsigs in their connected wallet
// 2. User can see Offer status

// User Journey for /collection/create-offer
// 1. User can list an Unsig
// - This means that the owner of an Unsig can create an offer for that Unsig

// Unsig PolicyID
const unsigID = "0e14267a8020229adc0184dd25fa3174c3f7d6caadcb4425c70e7c04";

async function getMyUnsigs() {
  let assetList = await getOwnedAssets();
  let myNFTS = await assetList;

  myNFTS.forEach(nft => {
    console.log(nft);
  })
}


// const playWithWallet = async () => {
//   const on = await enableWallet();
//   let myWord = ""
//   let myNFTS = []
//   let myOutput = []
//   console.log("the wallet is on! ", on)
//   if(on) {
//     .then(
//       assetList.forEach(element => {
//         if (element.startsWith(unsigID))
//         {
//           let output = fromHex(element.substring(56))
//           myWord = toString(output)
//           console.log(myWord)
//           myNFTS.push(myWord)
//         }  
//       })
//     ).then(myNFTS)
//   }
  
// }

const CollectionPage = ({ unsigs }) => {
  const connected = useStoreState((state) => state.connection.connected);
  getMyUnsigs();

  return (
    <main style={pageStyles}>
      <title>MY COLLECTION</title>
      <div>
        <h1>
          User Collection of Unsigs
        </h1>

        {connected ? (
          <div>
            <p>
              If wallet is connected, show the unsigs in connected wallet
            </p>
            <p>
              Wallet connected at address: {connected} has
            </p>
            <ul>
              <li>one</li>
            </ul>
          </div>
        ) : (
          <div>
            <p>
              If no wallet is connected, then prompt user to connect Nami wallet.
            </p>
          </div>
        )}
        <Collection>
        </Collection>
      </div>

    </main>
  )
}

export default CollectionPage

const Unsig = styled.div`
  background: #2037d9;
  color: white;
  margin: 10px;
  padding: 10px;
  width: 20rem;
`

const UnsigName = styled.h2`
  font-size: 3rem;
`
const Collection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

// Playing with Nami Wallet



//   const on = await enableWallet();
//   console.log("the wallet is on! ", on)
//   if(on) {
//     let assetList = await getOwnedAssets()
//     assetList.forEach(element => {
//       if (element.startsWith(unsigID))
//       {
//         let output = fromHex(element.substring(56))
//         console.log(toString(output))
//       }  

//     });  
//     let encbal = await getUtxos()
//     encbal.forEach(element => {
//       console.log(element);  
//       let bal = serializeTxUnspentOutput(element);
//       let assets = valueToAssets(bal.output().amount());
//       console.log(assets);
//     });

// }  
// } 