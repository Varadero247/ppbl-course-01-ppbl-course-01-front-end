import React, { useState, useEffect } from "react"
import { StaticImage } from "gatsby-plugin-image"
import data from "../../data/dummy-unsigs.json"
import styled from "styled-components"
import Cardano from "../cardano/serialization-lib"
import Wallet from "../cardano/wallet";
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction"
import { fromHex, toStr } from "../utils/converter"
import { useStoreActions, useStoreState } from "easy-peasy";

import { Unsig } from "../components/Unsig"

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
// const unsigID = "0e14267a8020229adc0184dd25fa3174c3f7d6caadcb4425c70e7c04";

// Testnet Unsig Policy ID:
const unsigID = "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d"

async function getWalletAssets() {
  await Cardano.load();
  const utxos = await Wallet.getUtxos();

  const nativeAssets = utxos
    .map((utxo) => serializeTxUnspentOutput(utxo).output())
    .filter((txOut) => txOut.amount().multiasset() !== undefined)
    .map((txOut) => valueToAssets(txOut.amount()))
    .flatMap((assets) =>
      assets
        .filter((asset) => asset.unit !== "lovelace")
        .map((asset) => asset.unit)
    );

  return [...new Set(nativeAssets)];
};

async function getMyUnsigs() {
  let assetList = await getWalletAssets();
  let myNFTS = [];

  assetList.forEach(nft => {
    if (nft.startsWith(unsigID)) {
      let output = fromHex(nft.substring(56))
      let myWord = toStr(output)
      let myNumber = myWord.substring(5)
      myNFTS.push(myNumber)
    }
  });

  console.log(myNFTS);
  return myNFTS;
}

async function getAllMyAssets() {
  let assetList = await getWalletAssets();
  let myNFTS = [];

  assetList.forEach(nft => {
    console.log(nft);
    let output = fromHex(nft.substring(56))
    let myWord = toStr(output)
    console.log(myWord)
    myNFTS.push(myWord)
  });

  console.log(myNFTS);
  return myNFTS;
}

const CollectionPage = ({ unsigs }) => {
  const connected = useStoreState((state) => state.connection.connected);
  const [collection, setCollection] = useState([]);
  const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);
  const setOwnedUnsigs = useStoreActions((actions) => actions.ownedUnsigs.add);

  useEffect(async () => {
    if(connected){
      const unsigs = await getMyUnsigs();
      setCollection(unsigs);
    }
  }, []);

  useEffect(() => {
    if(connected) {
      setOwnedUnsigs(collection);
    }
  }, [collection]);

  return (
    <main style={pageStyles}>
      <title>MY COLLECTION</title>
      <div>
        <h1>
          User Collection of Unsigs
        </h1>
        <ol>
          {ownedUnsigs.map((i) => <li>{i}</li>)}
        </ol>

        {connected ? (
          <div>
            <p>
              If wallet is connected, show the unsigs in connected wallet
            </p>
            <p>
              Wallet connected at address: {connected} has
            </p>
            <Collection>

              {collection.map((i) => <Unsig number={i} />)}

            </Collection>
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
//         console.log(toStr(output))
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