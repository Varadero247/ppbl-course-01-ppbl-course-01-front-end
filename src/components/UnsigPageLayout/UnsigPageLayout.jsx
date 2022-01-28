import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Center,
    Stack,
    Heading,
    Text,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
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

function getImageURL(unsigID, resolution) {
    // unsigID [0...31118]
    // resolution [128, 256, 512, 1024, 2048]
    const unsigNumber = unsigID;
    const res = resolution;
    const imageURL = "https://s3-ap-northeast-1.amazonaws.com/unsigs.com/images/" + res + "/" + unsigNumber + ".png";
    return imageURL;
}

function pad(num, size) {
    const res = num.toString();
    while (res.length < size) res = "0" + res;
    return res;
}

const backendBaseUrl = process.env.GATSBY_TESTNET_API_URL;

const UnsigPageLayout = (props) => {
    // props.number
    // props.isOffered

    // Todo: loading behavior

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
    const numString = pad(number, 5)
    const iURL = getImageURL(numString, "4096")

    const [unsigDetails, setUnsigDetails] = useState(emptyUnsig);

    const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);
    const isOwned = ownedUnsigs.includes(numString);

    // for chakra ui modal
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        fetch(`${backendBaseUrl}/unsigs/unsig${numString}`)
            .then(response => response.json())
            .then(resultData => { setUnsigDetails(resultData) })
    }, []);

    const formik = useFormik({
        initialValues: {
            unsigOfferPriceAda: 0,
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
        if (await Wallet.enable()) {
            const utxos = await Wallet.getUtxos();
            setWalletUtxos(utxos);
        }
    }, []);

    const fetchAssetUtxo = async () => {
        const datumHash = unsigDetails?.offerDetails?.datumHash;
        const unsigAsset = `${unsigPolicyId}${toHex(fromStr(`unsig${numString}`))}`;
        const response = await fetch(
            `${backendBaseUrl}/utxo?address=${contractAddress().to_bech32()}&unsigAsset=${unsigAsset}&datumHash=${datumHash}`
        )

        const assetUTxO = await response.json();

        return {
            "tx_hash": assetUTxO.txHash,
            "output_index": assetUTxO.outputIndex,
            "amount": assetUTxO.amount,
        }
    }

    const deleteAssetOffer = async () => {
        await fetch(`${backendBaseUrl}/offers`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "unsigId": `unsig${numString}`,
                "owner": unsigDetails?.offerDetails?.owner,
                "amount": unsigDetails.offerDetails.amount,
            })
        });
        console.log(`Offer for Unsig${numString} has been deleted!`);
    }

    const handleBuy = async () => {
        try {
            const seller = unsigDetails?.offerDetails?.owner
            const price = unsigDetails.offerDetails.amount

            const bfUTxO = await fetchAssetUtxo();

            const datum = createOfferDatum(seller, price, numString)
            const buyer = { "address": fromBech32(owner), "utxosParam": utxos }
            const txHash = await buyAsset(
                datum,
                buyer,
                fromBech32(seller),
                createTxUnspentOutput(contractAddress(), bfUTxO)
            )
            console.log("txHash is ", txHash)
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
            const seller = { "address": fromBech32(owner), "utxosParam": utxos }
            const listResult = await offerAsset(datum, seller)

            if (listResult && listResult.datumHash && listResult.txHash) {
                console.log(`${backendBaseUrl}/offers`)
                await fetch(`${backendBaseUrl}/offers`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                     },
                    body: JSON.stringify({
                        "unsigId": `unsig${numString}`,
                        "owner": owner,
                        "amount": currentOffer,
                        "txHash": listResult.txHash,
                        "datumHash": listResult.datumHash,
                        "txIndex": 0,
                    })
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
            const seller = { "address": fromBech32(owner), "utxosParam": utxos }

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

    return (
        <motion.div
            initial={{ opacity: 0, x: -1200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Flex w='70%' mx='auto' direction='row' bg='#232129' color='white' p='10'>
                <Flex w='90%' mx='auto'>

                    <Flex direction='column'>
                        {/* not sure why Gatsby's StaticImage doesn't work here, this is ok for now */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            <img src={iURL} alt="unsig" width={800} height={800} />
                        </motion.div>
                        <Center h='100px'>
                            {/* TODO 2022-01-19: how to check offers in owners wallet */}
                            {/* {isOwned ? (
                                <Button bg='#cccccc' color='#991111' borderRadius='0' mx='2' onClick={handleCancel}>Cancel Listing</Button>
                            ) : (
                                <Heading p='5' size='md'>Not Yours</Heading>
                            )} */}
                            {/* {(props.isOffered) ? (
                                <>
                                    <p>Offer price:</p>
                                    <Button bg='#cccccc' color='#115511' borderRadius='0' mx='2' onClick={handleBuy}>Buy this Unsig</Button>
                                </>
                            ) : (
                                <Heading p='5' size='md'>Not For Sale</Heading>
                            )} */}
                            {/* TODO Re-enable conditions */}
                            <Button bg='#cccccc' color='#991111' borderRadius='0' mx='2' onClick={handleCancel}>Cancel Listing</Button>
                            <Button bg='#cccccc' color='#115511' borderRadius='0' mx='2' onClick={handleBuy}>Buy this Unsig</Button>
                        </Center>
                    </Flex>

                    <Box ml='10'>
                        <Heading size='4xl'>
                            # {unsigDetails.details.index}
                        </Heading>
                        <Text fontSize='4xl' py='5'>
                            {unsigDetails.details.num_props} PROPS
                        </Text>

                        <Box mt='5'>
                            <Text mt='10' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.multipliers.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>MULTIPLIERS</Text>
                            <Text mt='10' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.colors.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>COLORS</Text>
                            <Text mt='10' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.distributions.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>DISTRIBUTIONS</Text>
                            <Text mt='10' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.rotations.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>ROTATIONS</Text>
                        </Box>
                        <Text fontSize='lg'>
                            {(isOwned) ? (
                                <>
                                    <Text fontSize='sm' width='50%' py='5'>
                                        You own this Unsig. To offer it for sale, enter a Sale Price and click "List this Unsig". After clicking the button, you will be promted to confirm your offer in your wallet.
                                    </Text>
                                    <Button colorScheme='teal' onClick={onOpen}>Create Offer OR Update Offer</Button>
                                    <Button colorScheme='teal' onClick={onOpen}>Create Offer OR Update Offer</Button>
                                    {/* Confetti, Confirmation... */}
                                    {/* Show offer price */}
                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>
                                                Create a listing for Unsig #{numString}
                                            </ModalHeader>
                                            <ModalCloseButton />
                                            <FormControl>
                                                <ModalBody p='5'>
                                                    <FormLabel>Enter your offer price here (in ADA)</FormLabel>
                                                    <Input name="unsigOfferPriceAda" onChange={formik.handleChange} value={formik.values.unsigOfferPriceAda} />
                                                    <FormHelperText color="#994444" pt='2'>
                                                        When you click "List this Unsig", you will be prompted to confirm this transaction in Nami Wallet.
                                                    </FormHelperText>
                                                </ModalBody>
                                                <ModalFooter p='5'>
                                                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                                                        Cancel
                                                    </Button>
                                                    <Button colorScheme='green' onClick={handleList}>List this Unsig</Button>
                                                </ModalFooter>
                                            </FormControl>
                                        </ModalContent>
                                    </Modal>
                                </>
                            ) : (
                                ""
                            )}
                        </Text>
                    </Box>
                </Flex>
            </Flex>

        </motion.div>
    );
}

export default UnsigPageLayout
