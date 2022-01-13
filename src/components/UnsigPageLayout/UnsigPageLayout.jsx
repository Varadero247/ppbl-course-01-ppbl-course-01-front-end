import React, { useState, useEffect } from "react";
import { Button, Center, Stack, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from "@chakra-ui/react";
import { motion } from "framer-motion"; // for hover, if time
import { Link } from "gatsby";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Formik, useFormik } from 'formik';
import { buyAsset, cancelOffer, offerAsset } from "../../cardano/market-contract";
import { createOfferDatum } from "../../utils/factory"
import { fromBech32 } from "../../utils/converter";
import { createTxUnspentOutput } from "../../cardano/transaction";
import { contractAddress } from "../../cardano/market-contract/validator";
import Wallet from "../../cardano/wallet";

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

const offerInfoStyle = {
    fontSize: "1rem"
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
    const setWalletUtxos = useStoreActions((actions) => actions.ownedUtxos.add)

    // need useEffect to update utxos after (1) creating offer and (2) success of that tx
    // what events does Nami provide that we can subscribe to?
    useEffect(async () => {
        const utxos = await Wallet.getUtxos();
        setWalletUtxos(utxos);
    }, []);

    const handleBuy = async () => {
        // get offer details from backend
        // (see handleCancel)

        // query blockfrost to get the txhash+txid (etc...) of the utxo holding the unsig i want to buy
        // Q: can this query include a filter on the datum hash?

        // get buyer details from wallet
        // const buyer = {"address": fromBech32(owner), "utxosParam": utxos}

        // get seller details from backend

        // recreate datum by
        // a) pulling offer price and seller address from backend
        // b) get the unsig id from the url param

        // get the hash of the datum we just recreated, and compare it to the datum has pulled from bf query

        // Q: what should we be checking to make sure this is working?

        //

        const blockfrostResponse =
            {
                "tx_hash": "9296d8fd4f464b1efe08fc8df63f689983e9b9bd47eac141002e01d45b2ac755",
                "tx_index": 0,
                "output_index": 0,
                "amount": [
                    {
                        "unit": "lovelace",
                        "quantity": "2000000"
                    },
                    {
                        "unit": "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d756e7369673030303136",
                        "quantity": "1"
                    }
                ],
                "block": "09fec04f85359b86c2f2b51469406af21001dd43e72e9fba4af755f21dd8cb70",
                "data_hash": "9c5de6bf6c9d49375e341067dd25e97f193d66c53fe758cc46b1e074336caab8"
            }


        try {
            const seller = "addr_test1qz2h42hnke3hf8n05m2hzdaamup6edfqvvs2snqhmufv0eryqhtfq6cfwktmrdw79n2smpdd8n244z8x9f3267g8cz6s59993r"
            // const seller = unsigDetails.offerDetails.owner
            const price = 100
            // const price = unsigDetails.offerDetails.amount

            const datum = createOfferDatum(seller, price, numString)
            const buyer = {"address": fromBech32(owner), "utxosParam": utxos}
            const txhash = await buyAsset(
                datum,
                buyer,
                fromBech32(seller),
                createTxUnspentOutput(contractAddress(), blockfrostResponse)
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleList = async () => {
        try {
            const datum = createOfferDatum(owner, currentOffer, numString)
            // console.log(utxos)
            const seller = {"address": fromBech32(owner), "utxosParam": utxos} // add current wallet utxos to state
            const listResult = await offerAsset(datum, seller)
            // console.log("Success", listResult)
            // returns datumHash and txHash --> show txHash to user; store it in backend as receipt?
            // we need the datumHash -- good idea to check that datumHash is right before we build a "buy asset" tx
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = async () => {
        try {
            // TODO: get offer details from backend
            const datum = createOfferDatum(owner, 900, numString)
            const seller = {"address": fromBech32(owner), "utxosParam": utxos}
            // we need an endpoint that takes two params: the contract address and the assetID

            // when endpoint returns utxo, check utxo datum hash against datum we just created
            // if there's a match, then we're confident that we're trying to consume the right utxo
            // TODO: can we gather these params from backend?
            // const bfUTxO = {tx_hash, output_index, amount, data_hash}

            // Here is an example of what we'll expect from blockfrost endpoint
            // Our backend should return this object to represent each OFFER
            // backend db should update when it confirms that UTXO exists at CONTRACT Address

            // Original test response:
            // Replace with relevant response from below

            // const bfUTxO = {
            //     "tx_hash": "1333e457b3feaa600a57db9fbb698500bbda50b6a7ba3255a4d1521c384fa978",
            //     "output_index": 0,
            //     "amount": [
            //         {
            //             "unit": "lovelace",
            //             "quantity": "2000000"
            //         },
            //         {
            //             // "unit": "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d.unsig00001", // we're pretty sure this doesn't work, double check
            //             "unit": "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d756e7369673030303031",
            //             "quantity": "1"
            //         }
            //     ],
            //     "data_hash": "1e305b7824e441540b61497609c5084bd53db4683673ba59083a633caa95857f"
            // }

            // Current Offers locked at Contract:
            // [
            // #00017
            //     {
            //         "tx_hash": "fcc578320e22d8dbba0ef6b43322db752f7d4d9a098a0bd42c17fb86f4d757c3",
            //         "tx_index": 0,
            //         "output_index": 0,
            //         "amount": [
            //             {
            //                 "unit": "lovelace",
            //                 "quantity": "2000000"
            //             },
            //             {
            //                 "unit": "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d756e7369673030303137",
            //                 "quantity": "1"
            //             }
            //         ],
            //         "block": "390763314be13dfd5f1684987f6354f4b1eef75cdd6d0cc28c8d56592dce75db",
            //         "data_hash": "805eab4897be8ba4c8029e06371794f8a372cf8f8aacbb324d11c34c55890442"
            //     },
            // #00005
            //     {
            //         "tx_hash": "288d41d77f6914d3fcc3d468726ac92bd09c01ad808faf690d87d332c9bfcab6",
            //         "tx_index": 0,
            //         "output_index": 0,
            //         "amount": [
            //             {
            //                 "unit": "lovelace",
            //                 "quantity": "2000000"
            //             },
            //             {
            //                 "unit": "1e82bbd44f7bd555a8bcc829bd4f27056e86412fbb549efdbf78f42d756e7369673030303035",
            //                 "quantity": "1"
            //             }
            //         ],
            //         "block": "eafd005f5f2b9185d8fb15c218217d2e1e6f1d065ed84a677f8ecb54a2b536f9",
            //         "data_hash": "20396beff6e759117c7360a52162f937d0fec1322e0289c82059149e994c193e"
            //     }
            // ]


            // and we can write a transaction with this utxo as input

            const assetUTxO = createTxUnspentOutput(contractAddress(), bfUTxO)
            console.log(assetUTxO)

            // NEXT STEP: Make cancelResult work
            const cancelResult = await cancelOffer(datum, seller, assetUTxO)
            console.log(cancelResult)
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
                            <Stack spacing={10}>
                                <Button colorScheme='teal' onClick={handleBuy}>If listed: Buy this Unsig</Button>

                                <Button colorScheme='red' onClick={handleCancel}>If owned and listed: Cancel</Button>
                            </Stack>
                        </Center>
                        <div style={{ color: "white"}}>
                        </div>

                    </div>

                    <div style={infoStyle}>
                        <p style={numberStyle}>
                            # {unsigDetails.details.index}
                        </p>
                        <p>
                            {(props.isOffered) ? ("Offer price=") : ("This Unsig is not for sale.")}
                            {(isOwned) ? (
                                <>
                                    <p style={offerInfoStyle}>You own this Unsig. To offer it for sale, enter a Sale Price and click "List this Unsig". After clicking the button, you will be promted to confirm your offer in your wallet.</p>
                                    <FormControl>
                                        <FormLabel>Sale Price:</FormLabel>
                                        <Input name="unsigOfferPriceAda" onChange={formik.handleChange} value={formik.values.unsigOfferPriceAda} />
                                    </FormControl>
                                    <Button colorScheme='orange' onClick={handleList}>List this Unsig</Button>
                                    <p style={offerInfoStyle}>
                                        (Note: remove this line) You entered an offer price of {currentOffer} ADA for Unsig # {unsigDetails.details.index}
                                    </p>
                                </>
                            ) : (
                                "not your unsig"
                            )}
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