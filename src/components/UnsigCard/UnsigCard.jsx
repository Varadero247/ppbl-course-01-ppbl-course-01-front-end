import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "gatsby";
import { useStoreState } from "easy-peasy";
import { Center } from "@chakra-ui/layout";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react"
import { ViewIcon } from "@chakra-ui/icons"

const unsigStyle = {
    display: "flex",
    flexDirection: "column",
    background: "#181818",
    color: "white",
    margin: "1rem",
    padding: "1rem",
}

const imageStyle = {
    marginBottom: "1rem"
}

function getImageURL(unsigID, resolution) {
    // unsigID [0...31118]
    // resolution [128, 256, 512, 1024, 2048]
    const unsigNumber = unsigID;
    const res = resolution;
    const imageURL = "https://s3-ap-northeast-1.amazonaws.com/unsigs.com/images/" + res + "/" + unsigNumber + ".png";
    return imageURL;
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

const UnsigProps = (props) => {
    return (
        <Center p='1'>
            <p style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                {props.number} <span style={{ fontSize: "0.9rem", fontWeight: "200" }}>PROPS</span>
            </p>
        </Center>
    )
}

const Owned = (props) => {
    if (props.owner) {
        return (
            <Center backgroundColor='#448844' p='1'>
                Owned
            </Center>
        )
    } else if (props.offerIsMine) {
        return (
            <Center backgroundColor='#ff0000' p='1' fontSize='xs'>
                My Offer: {props.price} ADA
            </Center>
        )
    } else if (props.offered) {
        return (
            <Center backgroundColor='#448844' p='1' fontSize='xs'>
                Offer: {props.price} ADA
            </Center>
        )
    } else {
        return (
            <Center p='1'>
                <ViewIcon />
            </Center>
        )
    }
}

const UnsigCard = (props) => {
    // props.number
    // props.numProps
    // props.isOffered
    // props.isOwned

    const number = props.number
    const numString = pad(number, 5)
    const iURL = getImageURL(numString, "1024")



    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            exit={{ opacity: 0, y: 50 }}
        >
            <Link to={`/marketplace/${number}`}>
                <div style={unsigStyle}>
                    <Box>
                        {/* not sure why Gatsby's StaticImage doesn't work here, this is ok for now */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}>
                            <img src={iURL} alt="unsig" width={256} height={256} style={imageStyle} />
                        </motion.div>
                        <h3>
                            # {props.number}
                        </h3>
                    </Box>
                    <Flex flexDirection='row'>
                        <UnsigProps number={props.numProps} />
                        <Spacer />
                        <Owned owner={props.owned} offered={props.offered} offerIsMine={props.offerIsMine} price={props.price} />
                    </Flex>


                </div>
            </Link>
        </motion.div>
    );
}

export default UnsigCard