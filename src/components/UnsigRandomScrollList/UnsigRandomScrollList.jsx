import React, { useState, useEffect } from "react";
import { Button, Center, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";


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
            <motion.div
                        initial={{ opacity: 0, scaleY: 0.1 }}
                        animate={{ opacity: 100, scaleY: 1.0 }}
                        transition={{ duration: 0.8 }}
            >
                <Flex direction='row' wrap='wrap'>
                    {loadedUnsigs.map((i) => (<Unsig key={i} number={i} />))}
                </Flex>
            </motion.div>
            <Center display='flex' w='100%' py='20px'>
                <Button onClick={handleLoadMore}>LOAD MORE</Button>
            </Center>
        </>
    )
};

export default UnsigRandomScrollList;