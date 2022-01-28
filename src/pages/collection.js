import React, { useState, useEffect } from "react"
import { StaticImage } from "gatsby-plugin-image"
import data from "../../data/dummy-unsigs.json"
import styled from "styled-components"
import Cardano from "../cardano/serialization-lib"
import Wallet from "../cardano/wallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction"
import { unsigPolicyId } from "../cardano/market-contract"
import { fromHex, toStr } from "../utils/converter"
import { useStoreActions, useStoreState } from "easy-peasy";

import { Unsig } from "../components/Unsig"
import { Box, Heading, Text, Flex } from "@chakra-ui/react"

// User Journey for /collection
// 1. User can view the Unsigs in their connected wallet
// 2. User can see Offer status

// User Journey for /collection/create-offer
// 1. User can list an Unsig
// - This means that the owner of an Unsig can create an offer for that Unsig

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
    if (nft.startsWith(unsigPolicyId)) {
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
  const setOfferedUnsigs = useStoreActions((actions) => actions.myOffers.add);
  const [myOffers, setMyOffers] = useState([]);

  useEffect(async () => {
    if (connected) {
      const unsigs = await getMyUnsigs();
      setCollection(unsigs);
      loadMyOffers();
    }
  }, []);

  useEffect(() => {
    if (connected) {
      setOwnedUnsigs(collection);
    }
  }, [collection]);

  const loadMyOffers = async () => {
    // offers endpoint is paginated, so this might not actually work
    // TODO - create new endpoint /api/v1/offersByOwner...
    const response = await fetch(`http://localhost:8088/api/v1/offers?owner=${connected}`)
    const data = await response.json()
    // Above line will be removed after we call new endpoint
    setMyOffers(data);
    console.log("MY OFFERS", data.resultList)
  }

  useEffect(() => {
    setOfferedUnsigs(myOffers);
  }, [myOffers])


  return (
    <Box w='100%' px='24' py='12' bg='#232129' color='white'>
      <title>MY COLLECTION</title>
      <Box>
        <Heading size='4xl' fontWeight='medium'>
          My Collection
        </Heading>
        {connected ? (
          <Box>
            { (myOffers.resultList?.length > 0) ? (
              <Box my='5'>
                <Heading py='5'>
                  For Sale:
                </Heading>
                <Flex direction='row'>
                  {myOffers?.resultList?.map((i) => <Unsig key={i} number={i.details.index} price={i.amount} />)}
                </Flex>
                { (collection.length > 0) ? (
                  <Heading py='5'>
                    Hodling:
                  </Heading>
                ) : ("")}
              </Box>
            ) : (
              <Box my='5'>
                <Text fontSize='2xl'>
                  Click on an Unsig to create an offer.
                </Text>
              </Box>
            )}
            <Flex direction='row'>
              {collection.map((i) => <Unsig key={i} number={i} />)}
            </Flex>
            <Box py='10'>
              <Text fontSize='xl' py='3'>
                Wallet connected at address:
              </Text>
              <Heading fontSize='md' fontWeight='light'>
                {connected}
              </Heading>
            </Box>
          </Box>
        ) : (
          <div>
            <Text fontSize='xl' py='3'>
              To view your collection of Unsigs, please connect a wallet.
            </Text>
          </div>
        )}

      </Box>

    </Box>
  )
}

export default CollectionPage

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