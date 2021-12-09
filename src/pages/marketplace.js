import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import data from "../../data/dummy-unsigs.json"
import styled from "styled-components"
import Cardano from "../cardano/serialization-lib"
import { enableWallet, getBalance, getUtxos, getOwnedAssets } from "../cardano/wallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction"
import { fromHex, toString } from "../utils/converter"

// User Journey for /offer
// 1. User can go to /offer and view all offers (separate from explore page)
// 2. User can click on offers and see the details for an asset
// - unsig nft properties
// - offer details
// User Journey for /offer/{unsig}
// 3. When a user is viewing asset details, the user can buy the asset
// - if connected wallet, buy button is active


// Unsig PolicyID
const unsigID = "0e14267a8020229adc0184dd25fa3174c3f7d6caadcb4425c70e7c04";

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}  
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}  

const buttonStyle = {
  backgroundColor: "purple",
  padding: "1rem",
  color: "white"
}  

const load = async () => {
  await Cardano.load();
}  


// Playing with Nami Wallet
const connect = async () => {
  await load();
  const on = await enableWallet();
  console.log("the wallet is on! ", on)
  if(on) {
    let assetList = await getOwnedAssets()
    assetList.forEach(element => {
      if (element.startsWith(unsigID))
      {
        let output = fromHex(element.substring(56))
        console.log(toString(output))
      }  
      
    });  
    //let encbal = await getUtxos()
    // encbal.forEach(element => {
    //   console.log(element);  
    //   let bal = serializeTxUnspentOutput(element);
    //   let assets = valueToAssets(bal.output().amount());
    //   console.log(assets);
    // });
  }  
}  


const MarketplacePage = ({unsigs}) => {

  return (
    <main style={pageStyles}>
      <title>FOR SALE</title>
      <h1 style={headingStyles}>
        THE MARKETPLACE
      </h1>
      <button style={buttonStyle} onClick={connect}>
        Use this button to test Nami integration
      </button>
      <Collection>
        {data.unsigs.map((i) => (
          <Unsig key={Object.keys(i)}>
            <UnsigName>{Object.keys(i)}</UnsigName>
            <p>{Object.values(i)[0].title}</p>
            <p>Properties: {Object.values(i)[0].unsigs.num_props}</p>
            <p>{Object.values(i)[0].image}</p>
            <img src={`https://infura-ipfs.io/ipfs/${Object.values(i)[0].image}`} alt="unsig" />
          </Unsig>
        ))}
      </Collection>
    </main>
  )
}

export default MarketplacePage

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