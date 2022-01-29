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
    let res = num.toString();
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

    let number = 0

    if (props.number) {
        number = props.number
    }
    const numString = pad(number, 5)
    const iURL = getImageURL(numString, "4096")

    const [unsigDetails, setUnsigDetails] = useState(emptyUnsig);

    const ownedUnsigs = useStoreState((state) => state.ownedUnsigs.unsigIds);
    const isOwned = ownedUnsigs.includes(numString);

    const isOffered = unsigDetails.offerDetails;
    let offerOwner = null;
    if (isOffered) {
        offerOwner = unsigDetails.offerDetails.owner;
    }


    // const myOffers = useStoreState((state) => state.myOffers.unsigIds);
    // const isMyOffer = myOffers.includes(numString);


    // for chakra ui modals
    const { isOpen: isCreateOfferOpen , onOpen: onCreateOfferOpen, onClose: onCreateOfferClose } = useDisclosure()
    const { isOpen: isOfferSuccessOpen , onOpen: onOfferSuccessOpen, onClose: onOfferSuccessClose } = useDisclosure()
    const { isOpen: isCancelSuccessOpen , onOpen: onCancelSuccessOpen, onClose: onCancelSuccessClose } = useDisclosure()
    const { isOpen: isBuySuccessOpen , onOpen: onBuySuccessOpen, onClose: onBuySuccessClose } = useDisclosure()
    const { isOpen: isErrorOpen , onOpen: onErrorOpen, onClose: onErrorClose } = useDisclosure()



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

    const isOfferOwner = (owner && (owner === offerOwner))

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
            onBuySuccessOpen();
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
                handleSuccess();
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
            onCancelSuccessOpen();
        } catch (error) {
            console.log(error)
        }
    }

    const handleSuccess = () => {
        onCreateOfferClose();
        onOfferSuccessOpen();
    }

    const handleError = () => {
        onErrorOpen();
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
                    </Flex>

                    <Box ml='10'>
                        <Heading size='4xl'>
                            # {unsigDetails.details.index}
                        </Heading>
                        <Text fontSize='4xl' py='3'>
                            {unsigDetails.details.num_props} PROPS
                        </Text>
                        <Box mt='3'>
                            <Text mt='5' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.multipliers.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>MULTIPLIERS</Text>
                            <Text mt='5' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.colors.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>COLORS</Text>
                            <Text mt='5' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.distributions.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>DISTRIBUTIONS</Text>
                            <Text mt='5' fontSize='xl' fontWeight='bold'>
                                [{unsigDetails.details.properties.rotations.join(", ")}]{"  "}
                            </Text>
                            <Text fontWeight='light' letterSpacing='3px'>ROTATIONS</Text>
                        </Box>
                        {/* { isMyOffer ? ("You are currently offering this for sale") : ("Not owned or not offered") } */}
                        { (isOffered && !isOfferOwner) ? (
                            <>
                                <Flex direction='column' my='3'>
                                    <Button bg='#cccccc' color='#115511' borderRadius='0' width="50%" mb='3' onClick={handleBuy}>
                                        Buy for {unsigDetails.offerDetails.amount} ADA
                                    </Button>
                                    <Text fontSize='sm'>
                                        When you click this button you will be prompted to confirm the transaction in Nami wallet.
                                    </Text>
                                </Flex>
                                <Modal isOpen={isBuySuccessOpen} onClose={onBuySuccessClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>
                                            Success!
                                        </ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody p='5' bg='black'>
                                            <Text p='3' fontStyle='bold' color='white'>You just bought an Unsig! And the transaction is valid.</Text>
                                            <Text p='3' fontStyle='bold' color='white'>You will not see the Unsig in your wallet until the transaction is confirmed on chain.</Text>
                                        </ModalBody>
                                        <ModalFooter p='5' justifyContent='center'>
                                            <Button colorScheme='green' onClick={onBuySuccessClose}>ok</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </>
                        ) : (
                            ""
                        )}
                        { isOfferOwner ? (
                            <>
                                <Flex direction='column' my='3' bg='black' p='3'>
                                    <Heading size='md' width='80%' mx='auto' mb='3'>
                                        You are currently offering this Unsig for {unsigDetails.offerDetails.amount} ADA
                                    </Heading>
                                    <Button bg='#cccccc' color='#991111' borderRadius='0' width="50%" mx='auto' onClick={handleCancel}>
                                        Cancel My Offer
                                    </Button>
                                    <Text fontSize='sm' width='80%' mx='auto' mt='3'>
                                        When you click this button you will be prompted to confirm the transaction in Nami wallet.
                                    </Text>
                                </Flex>
                                <Modal isOpen={isCancelSuccessOpen} onClose={onCancelSuccessClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>
                                            Got It
                                        </ModalHeader>
                                        <ModalCloseButton />
                                        <ModalBody p='5' bg='black'>
                                            <Text p='3' fontStyle='bold' color='white'>You just canceled your offer for this Unsig. The transaction is valid, and this Unsig no longer appears in the marketplace.</Text>
                                            <Text p='3' fontStyle='bold' color='white'>You will not see the Unsig in your wallet until the transaction is confirmed on chain.</Text>
                                        </ModalBody>
                                        <ModalFooter p='5' justifyContent='center'>
                                            <Button colorScheme='green' onClick={onCancelSuccessClose}>ok</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </>
                        ) : (
                            ""
                        )}

                        <Text fontSize='lg'>
                            {(isOwned) ? (
                                <>
                                    <Text fontSize='sm' width='50%' py='5'>
                                        You own this Unsig. To offer it for sale, click Create Offer.
                                    </Text>
                                    <Button colorScheme='teal' onClick={onCreateOfferOpen}>Create Offer</Button>
                                    {/* Confetti, Confirmation... */}
                                    {/* Show offer price */}
                                    <Modal isOpen={isCreateOfferOpen} onClose={onCreateOfferClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>
                                                Create an Offer for Unsig #{numString}
                                            </ModalHeader>
                                            <ModalCloseButton />
                                            <FormControl>
                                                <ModalBody p='5'>
                                                    <FormLabel>Enter your Offer price here (in ADA)</FormLabel>
                                                    <Input name="unsigOfferPriceAda" onChange={formik.handleChange} value={formik.values.unsigOfferPriceAda} />
                                                    <FormHelperText color="#994444" pt='2'>
                                                        When you click "List this Unsig", you will be prompted to confirm this transaction in Nami Wallet.
                                                    </FormHelperText>
                                                </ModalBody>
                                                <ModalFooter p='5'>
                                                    <Button colorScheme='blue' mr={3} onClick={onCreateOfferClose}>
                                                        Cancel
                                                    </Button>
                                                    <Button colorScheme='green' onClick={handleList}>List this Unsig</Button>
                                                </ModalFooter>
                                            </FormControl>
                                        </ModalContent>
                                    </Modal>
                                    <Modal isOpen={isOfferSuccessOpen} onClose={onOfferSuccessClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>
                                                Success!
                                            </ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody p='5' bg='black'>
                                                <Text p='3' fontStyle='bold' color='white'>Your offer has been created, and the transaction is valid.</Text>
                                                <Text p='3' fontStyle='bold' color='white'>You will still see the Unsig in your wallet until the transaction is confirmed on chain.</Text>
                                                <Text p='3' fontStyle='bold' color='white'>(On your Collection Page, you might also see two instances of this Unsig, until the tx is confirmed.)</Text>
                                            </ModalBody>
                                            <ModalFooter p='5' justifyContent='center'>
                                                <Button colorScheme='green' onClick={onOfferSuccessClose}>ok</Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </>
                            ) : (
                                ""
                            )}
                        </Text>
                        <Modal isOpen={isErrorOpen} onClose={onErrorClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>
                                    Error
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody p='5' bg='black'>
                                    <Text p='3' fontStyle='bold' color='white'>
                                        Transaction not submitted.
                                    </Text>
                                    <Text p='3' fontStyle='bold' color='white'>
                                        Error message:
                                    </Text>
                                </ModalBody>
                                <ModalFooter p='5' justifyContent='center'>
                                    <Button colorScheme='green' onClick={onErrorClose}>ok</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Box>
                </Flex>
            </Flex>

        </motion.div>
    );
}

export default UnsigPageLayout
