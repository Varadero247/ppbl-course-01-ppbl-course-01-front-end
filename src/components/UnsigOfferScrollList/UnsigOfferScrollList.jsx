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
        const response = await fetch('http://localhost:8088/api/v1/offers')
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
                                isOwned={ownedUnsigs.includes(i.unsigId.substring(5))}
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