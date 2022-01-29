import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // for hover, if time
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

const Unsig = (props) => {
    // props.number
    // props.isOffered

    // File under why I wish I knew TypeScript
    const emptyUnsig = {
        "unsigId": "",
        "details": {
            "index": 0,
            "num_props": 0,
            "properties": {
                "multipliers": [],
                "colors": [],
                "distributions": [],
                "rotations": []
            }
        }
    }
    const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);

    const number = props.number
    const numString = pad(number, 5)
    const iURL = getImageURL(numString, "1024")

    const [unsigDetails, setUnsigDetails] = useState(emptyUnsig);
    const isOwned = ownedUnsigs.includes(numString)


    useEffect(() => {
        fetch(`${process.env.GATSBY_TESTNET_API_URL}/unsigs/unsig${numString}`)
            .then(response => response.json())
            .then(resultData => { setUnsigDetails(resultData) })
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 1.2 }}
        >
            <Link to={`/marketplace/${number}`}>
                <div style={unsigStyle}>
                    <Box>
                        {/* not sure why Gatsby's StaticImage doesn't work here, this is ok for now */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }}>
                            <img src={iURL} alt="unsig" width={256} height={256} style={imageStyle} />
                        </motion.div>
                        <h3>
                            # {unsigDetails.details.index}
                        </h3>
                    </Box>
                    <Flex flexDirection='row'>
                        <UnsigProps number={unsigDetails.details.num_props} />
                        <Spacer />
                        <Owned owner={isOwned} offered={unsigDetails.offerDetails} price={props.price} />
                    </Flex>


                </div>
            </Link>
        </motion.div>
    );
}

export default Unsig