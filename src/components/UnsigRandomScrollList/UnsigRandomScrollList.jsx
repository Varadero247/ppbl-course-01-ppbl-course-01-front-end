import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Button, Center, useToast } from "@chakra-ui/react";
import styled from "styled-components";

import Unsig from "../Unsig/Unsig";

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

const makeNumberList = (incoming, count) => {
    let output = incoming
    let i = 0
    while (i < count) {
        let next = getRandomInt(31119);
        while (output.includes(next)) {
            next = getRandomInt(31119);
        }
        output.push(getRandomInt(31119));
        i++;
    }
    return output
}

const collectionStyles = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
}

const UnsigRandomScrollList = (props) => {
    const unsigList = makeNumberList([], 12);
    const [loading, setLoading] = useState(false);
    const [loadedUnsigs, setLoadedUnsigs] = useState(unsigList)

    const handleLoadMore = () => {
        setLoading(true)
    };

    useEffect(() => {
        if (loading) {
            let newList = makeNumberList(loadedUnsigs, 12);
            setLoadedUnsigs(newList)
            setLoading(false);
        }
    }, [loading]);

    return (
        <>
            <motion.div style={collectionStyles}>
                {loadedUnsigs.map((i) => (<Unsig key={i} number={i} />))}
            </motion.div>
            <Center display='flex' w='100%'>
                <Button onClick={handleLoadMore}>LOAD MORE</Button>
            </Center>
        </>
    )
};

export default UnsigRandomScrollList;