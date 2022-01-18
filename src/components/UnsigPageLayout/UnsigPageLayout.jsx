import React, { useState, useEffect } from "react";
import { Button, Center, Stack, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from "@chakra-ui/react";
import { motion } from "framer-motion"; // for hover, if time
import { Link } from "gatsby";
import { useStoreState, useStoreActions } from "easy-peasy";
import { Formik, useFormik } from 'formik';
import { buyAsset, cancelOffer, offerAsset, unsigPolicyId } from "../../cardano/market-contract";
import { createOfferDatum } from "../../utils/factory"
import { fromBech32, fromStr, toHex } from "../../utils/converter";
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

const backendBaseUrl = "http://localhost:8088/api/v1/";

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
        fetch(`${backendBaseUrl}unsigs/unsig${numString}`)
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

    const fetchAssetUtxo = async () => {
        const datumHash = unsigDetails?.offerDetails?.datumHash;
        const unsigAsset = `${unsigPolicyId}${toHex(fromStr(`unsig${numString}`))}`;
        const response = await fetch(
            `${backendBaseUrl}utxo?address=${contractAddress().to_bech32()}&unsigAsset=${unsigAsset}&datumHash=${datumHash}`
        )

        const assetUTxO = await response.json();

        return {
            "tx_hash": assetUTxO.txHash,
            "output_index": assetUTxO.outputIndex,
            "amount": assetUTxO.amount,
        }
    }

    const deleteAssetOffer = async () => {
        await fetch(`${backendBaseUrl}offers`, {
            method: "DELETE",
            body: {
                "unsigId": `unsig${numString}`,
                "owner": owner,
                "amount": currentOffer,
            }
        });
        console.log(`Offer for Unsig${numString} has been deleted!`);
    }

    const handleBuy = async () => {
        try {
            const seller = unsigDetails?.offerDetails?.owner
            const price = unsigDetails.offerDetails.amount

            const bfUTxO = await fetchAssetUtxo();

            const datum = createOfferDatum(seller, price, numString)
            const buyer = {"address": fromBech32(owner), "utxosParam": utxos}
            const txhash = await buyAsset(
                datum,
                buyer,
                fromBech32(seller),
                createTxUnspentOutput(contractAddress(), bfUTxO)
            )
            if (txHash) {
                await deleteAssetOffer();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleList = async () => {
        try {
            const datum = createOfferDatum(owner, currentOffer, numString)
            const seller = {"address": fromBech32(owner), "utxosParam": utxos}
            const listResult = await offerAsset(datum, seller)
            
            if (listResult && listResult.datumHash && listResult.txHash) {
                await fetch(`${backendBaseUrl}offers`, {
                    method: "PUT",
                    body: {
                        "unsigId" : `unsig${numString}`,
                        "owner" : owner,
                        "amount" : currentOffer,
                        "txHash" : listResult.txHash,
                        "datumHash" : listResult.datumHash,
                        "txIndex" : 0,
                      }
                });
                console.log(`Offer for Unsig${numString} has been created!`);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = async () => {
        try {
            const price = unsigDetails?.offerDetails?.amount;
            const datum = createOfferDatum(owner, price, numString)
            const seller = {"address": fromBech32(owner), "utxosParam": utxos}

            const bfUTxO = await fetchAssetUtxo();

            const assetUTxO = createTxUnspentOutput(contractAddress(), bfUTxO)
            const txHash = await cancelOffer(datum, seller, assetUTxO)
            if (txHash) {
                await deleteAssetOffer();
            }
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
