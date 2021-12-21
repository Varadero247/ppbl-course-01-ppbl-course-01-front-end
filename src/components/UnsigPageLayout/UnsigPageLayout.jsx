import React, { useState, useEffect } from "react";
import { Button, Center, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion"; // for hover, if time
import { Link } from "gatsby";
import { useStoreState } from "easy-peasy";
import { Formik, useFormik } from 'formik';
import { offerAsset } from "../../cardano/market-contract";
import { createOfferDatum } from "../../utils/factory"

const unsigStyle = {
    display: "flex",
    flexDirection: "row",
    background: "#232129",
    color: "white",
    marginTop: "2rem",
    padding: "2rem",
}

const imageStyle = {

}

const detailRow = {
    display: "flex",
    flexDirection: "row",
    color: "white",
    margin: "1rem",
    padding: "1rem"
}

const numberStyle = {
    fontSize: "6rem"
}

const infoStyle = {
    marginLeft: "2rem",
    fontSize: "2rem"
}

const propertiesStyle = {
    listStyleType: "none",
    margin: "0",
    marginTop: "3 rem",
    padding: "0",
}

const propertiesNameStyle = {
    fontSize: "0.9rem",
    letterSpacing: "0.3rem"
}

const propertiesItemStyle = {
    marginTop: "2rem"
}

// play with hover if time
// const unsigOverlayStyle = {
//     zIndex: 20,
//     padding: "1rem",
//     margin: "1rem",
//     fontSize: "1rem",
// }

function getImageURL (unsigID, resolution) {
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

const UnsigPageLayout = (props) => {
// props.number
// props.isOffered

// Todo: loading behavior


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

    const number = props.number
    const numString = pad(number,5)
    const iURL = getImageURL (numString, "4096")

    const [unsigDetails, setUnsigDetails] = useState(emptyUnsig);

    const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);
    const isOwned = ownedUnsigs.includes(numString);

    useEffect(() => {
        fetch(`http://localhost:8088/api/v1/unsigs/unsig${numString}`)
            .then(response => response.json())
            .then(resultData => {setUnsigDetails(resultData)})
    }, []);

    const formik = useFormik({
        initialValues: {
            unsigOfferPriceAda: 100,
        },
    })

    const [currentOffer, setCurrentOffer] = useState(formik.unsigOfferPriceAda)

    useEffect(() => {
        const n = formik.values.unsigOfferPriceAda;
        setCurrentOffer(n);
    }, [formik.values.unsigOfferPriceAda])

    // need useEffect to update ownership

    const owner = useStoreState((state) => state.connection.connected)
    const utxos = useStoreState((state) => state.ownedUtxos.utxos)

    const handleList = async () => {
        try {
            const datum = createOfferDatum(owner, currentOffer, numString)
            console.log(utxos)
            const seller = {"address": owner, "utxosParam": utxos} // add current wallet utxos to state
            const listResult = await offerAsset(datum, seller)
            console.log("Success", listResult)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <motion.div
            initial={{ opacity: 0, x: -1200}}
            animate={{ opacity: 1, x: 0}}
            transition={{ duration: 0.5 }}
        >
            <Link to={`/marketplace/${number}`}>
                <div style={unsigStyle}>
                    <div style={{ display: "flex", flexDirection: "column"}}>
                        {/* not sure why Gatsby's StaticImage doesn't work here, this is ok for now */}
                        <motion.div initial={{ opacity: 0}} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            <img src={iURL} alt="unsig" width={800} height={800} style={imageStyle} />
                        </motion.div>
                        <Center h='100px'>
                            <Stack direction='row' spacing={10}>
                                <Button colorScheme='teal'>If listed: Buy this Unsig</Button>
                                <Button colorScheme='teal' onClick={handleList}>If owned: List this Unsig</Button>
                                <Button colorScheme='teal'>If owned and listed: Cancel</Button>
                            </Stack>
                        </Center>
                        <div style={{ backgroundColor: "red", color: "black"}}>
                            <form>
                                <label>Sale Price:</label>
                                <input name="unsigOfferPriceAda" onChange={formik.handleChange} value={formik.values.unsigOfferPriceAda} />
                            </form>
                            <div>
                                {currentOffer}
                            </div>
                        </div>

                    </div>

                    <div style={infoStyle}>
                        <p style={numberStyle}>
                            # {unsigDetails.details.index}
                        </p>
                        <p>
                            {(props.isOffered) ? ("Offer price=") : ("not for sale")} {" | "}
                            {(isOwned) ? ("You own this!") : ("not your unsig")}
                        </p>
                        <p style={numberStyle}>
                            {unsigDetails.details.num_props}
                        </p>
                        <p>
                            PROPERTIES
                        </p>
                        <ul style={propertiesStyle}>
                            <li style={propertiesItemStyle}>[{unsigDetails.details.properties.multipliers.join(", ")}]{"  "} <span style={propertiesNameStyle}>MULTIPLIERS</span></li>
                            <li style={propertiesItemStyle}>[{unsigDetails.details.properties.colors.join(", ")}]{"  "} <span style={propertiesNameStyle}>COLORS</span></li>
                            <li style={propertiesItemStyle}>[{unsigDetails.details.properties.distributions.join(", ")}]{"  "}<span style={propertiesNameStyle}>DISTRIBUTIONS</span></li>
                            <li style={propertiesItemStyle}>[{unsigDetails.details.properties.rotations.join(", ")}]{"  "}<span style={propertiesNameStyle}>ROTATIONS</span></li>
                            <li style={propertiesItemStyle}>[coming soon!]{"  "} <span style={propertiesNameStyle}>COLLECTIONS</span></li>
                        </ul>
                    </div>

                </div>
            </Link>
        </motion.div>
    );
}

export default UnsigPageLayout