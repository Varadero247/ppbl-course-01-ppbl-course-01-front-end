import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import data from "../../data/dummy-unsigs.json"
import styled from "styled-components"
import Cardano from "../cardano/serialization-lib"

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

const load = async () => {
  await Cardano.load();
  console.log("woohoo!");
}

const ExplorePage = ({unsigs}) => {

  return (
    <main style={pageStyles}>
      <title>Explore</title>
      <h1 style={headingStyles}>
        Explore the Collection
      </h1>
      <button onClick={load}>
        CLICK ME
      </button>
      <Collection>
        {data.unsigs.map((i) => (
          <Unsig>
            <UnsigName>{Object.keys(i)}</UnsigName>
            <p>{Object.values(i)[0].title}</p>
            <p>Properties: {Object.values(i)[0].unsigs.num_props}</p>
            <p>{Object.values(i)[0].image}</p>
            <img src={`https://infura-ipfs.io/ipfs/${Object.values(i)[0].image}`} />
          </Unsig>
        ))}
      </Collection>
    </main>
  )
}

export default ExplorePage

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