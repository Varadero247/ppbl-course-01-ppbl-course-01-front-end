import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
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
                    <Flex direction='row' wrap='wrap' justify='center'>
                        {loadedUnsigData.map((i) => (
                            <UnsigCard
                                number={i.details.index}
                                numProps={i.details.num_props}
                                owned={ownedUnsigs.includes(i.unsigId.substring(5))}
                                offered={true}
                                price={i.amount}
                            />
                        ))}
                    </Flex>
                )
            }
        </>
    )
};

export default UnsigOfferScrollList;
