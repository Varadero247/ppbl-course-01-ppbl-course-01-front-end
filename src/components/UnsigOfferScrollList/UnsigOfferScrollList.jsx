import React, { useState, useEffect } from "react";
import { Button, Box, Center } from "@chakra-ui/react";
import styled from "styled-components";
import { useStoreState } from "easy-peasy";

import { UnsigCard } from "../UnsigCard"

const UnsigOfferScrollList = (props) => {

    const [loading, setLoading] = useState(true);
    const [loadedUnsigData, setLoadedUnsigData] = useState(null);
    const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);

    // get the data
    useEffect(async () => {
        const response = await fetch(`${process.env.GATSBY_TESTNET_API_URL}/offers`)
        const data = await response.json();
        setLoadedUnsigData(data.resultList)
        console.log("loaded", loadedUnsigData)
    }, [])

    return (
        <>
             {(!loadedUnsigData) ?
                ("loading") : (
                    <Collection>
                        {loadedUnsigData.map((i) => (
                            <UnsigCard
                                number={i.details.index}
                                numProps={i.details.num_props}
                                owned={ownedUnsigs.includes(i.unsigId.substring(5))}
                                offered={true}
                                price={i.amount}
                            />
                        ))}
                    </Collection>
                )
            }
        </>
    )
};

export default UnsigOfferScrollList;

const Collection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`