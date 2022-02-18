import React, { useEffect, useState } from "react";
import { useStoreState} from "easy-peasy";
import { fromAscii, fromHex, toStr } from "../utils/converter";
import { Flex, Heading, Text, Box } from "@chakra-ui/react";
import useWallet from "../hooks/useWallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction";

// PPBL Weeks 2-3
// 1. Establish the concept of UTxO
// 2. Learn three ways to mint native assets
// 3. Establish a defintion of Value, and show Values in Plutus + on front-end

// from connected wallet, get all UTXOs
function getWalletUtxoStrings(wallet) {
    const utxoStrings = wallet.utxos
        .map((utxo) => serializeTxUnspentOutput(utxo).output())
        .map((txOut) => valueToAssets(txOut.amount()))
    return [...new Set(utxoStrings)];
};

// given a hex-encoded Unit in a Value pair, return the policyID
function getPolicyId(unit) {
    let id = ""
    if (unit == "lovelace") {
        return ""
    }
    else {
        id = unit.slice(0, 56)
    }
    return id
}

// given a hex-encoded Unit in a Value pair, return the asset name
function getTokenName(unit) {
    let name = ""
    if (unit == "lovelace") {
        return "ada"
    }
    else {
        let temp = fromHex(unit.substring(56))
        name = toStr(temp)
    }
    return name
}

// PPBL: We will review how "Value" is defined in Plutus, and see how this data type works in and outside of Haskell
// If we're going to talk about Minting native assets, we need to understand how Values work!

// given a hex-encoded Unit and Quantity in a Value pair,
function getQuantity(unit, quantity) {
    if (unit == "lovelace") {
        return quantity / 1000000
    }
    return quantity
}

// Given a wallet, get an array of utxos, each of which is represented by an array of values
// There is a degree of redundancy here: we could just take the output of getWalletUtxoStrings as the parameter...
// ...or just combine the functions.
// Keeping them separate for now for PPBL teaching purposes
function getWalletAssetValues(wallet) {
    const utxoStrings = getWalletUtxoStrings(wallet);
    const assetValues = utxoStrings.map((utxoString) => utxoString.map((currentValue) => ({
        policy: getPolicyId(currentValue.unit),
        unit: getTokenName(currentValue.unit),
        quantity: getQuantity(currentValue.unit, currentValue.quantity)
    })))
    return [...new Set(assetValues)]
}

// Look for a particular asset in a wallet
function walletHoldsThisAsset(assetList, policyId, name) {
    let quantity = 0
    assetList.map((utxo) => {
        utxo.map((asset) => {
            if ((asset.policy === policyId) && (asset.unit === name)) {
                console.log("assets", asset.policy, "name", asset.unit)
                quantity = asset.quantity
            }
        })
    })
    return quantity
}

// Looking for a little challenge?
// Try to write a function that gets the sum of all Ada in the connected wallet.
// Then write a function that lists the sum of each asset.

const PPBLDapp = () => {
    const connected = useStoreState((state) => state.connection.connected);
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletUtxos, setWalletUtxos] = useState([]);
    const [walletAssets, setWalletAssets] = useState([]);
    const [ppblTokenHeld, setPpblTokenHeld] = useState(0);
    const { wallet } = useWallet(null);
    const [loading, setLoading] = useState(false);

    // on loading change, if wallet is connected, set wallet address
    useEffect(async () => {
        if (connected && wallet) {
            const addr = await wallet.address;
            setWalletAddress(addr);
            console.log(addr)
        }
    }, [loading])

    // when wallet is connected, load utxo array and wallet asset array
    useEffect(async () => {
        if (connected && wallet) {
            const myUtxos = await wallet.utxos;
            setWalletUtxos(myUtxos);
            setWalletAssets(getWalletAssetValues(wallet))
            console.log(myUtxos)
            setLoading(false)
        }
    }, [wallet])

    // monitor loading state, and us it to trigger other hooks if no utxos are loaded
    useEffect(() => {
        if (walletUtxos.length == 0) {
            setLoading(true)
        }
        if (loading) {
            setLoading(false)
        }
    }, [walletUtxos])

    useEffect(() => {
        setPpblTokenHeld(walletHoldsThisAsset(walletAssets, "3794c001b97da7a47823ad27b29e049985a9a97f8aa6908429180e2c", "PlutusPBLCourse01"))
    }, [loading])


    return (
        <>
            <title>demo v0</title>
            <Flex w='100%' mx='auto' direction='column' wrap='wrap' bg='gl-yellow' p='10'>
                <Box w='50%' mx='auto'>
                    <Heading size='4xl' color='gl-blue' fontWeight='medium' py='5'>PPBL Demo "Dapp"</Heading>
                    <Heading py='5' size='lg'>First things first:</Heading>
                    <Text py='3' fontSize='lg'>
                        This "decentralized application" (or "Dapp") does not do much - at least not yet! The purpose of this demo is simply to show you that by using a browser-extension-based wallet like Nami (or CCValut, Flint), you can see information from the blockchain on the front-end of a web site.
                    </Text>
                    <Text py='3' fontSize='lg'>
                        Our goal is to help you get comfortable with these tools and to see how they all work together, before we start going deeper.
                    </Text>
                    <Text py='3' fontSize='lg'>
                        So what can this Dapp do?
                    </Text>
                    <Heading py='5' size='lg'>It can show you the Address of your connected wallet:</Heading>
                    <Text py='3' fontSize='lg'>
                        {walletAddress}
                    </Text>
                    {loading ? (
                        <Box>
                            loading...
                        </Box>
                    ) : (
                        <Box my='5'>
                            {/* <Heading py='5'>Utxos</Heading> */}
                            {/* In PPBL, we may want to look at this raw UTXO representation */}
                            {/* <Heading py='5' size='lg'>UTxO Strings (hidden)</Heading> */}

                            <Heading py='5' size='lg'>It can show you the UTx0s in your connected wallet:</Heading>
                            <Text py='3' fontSize='lg'>
                                Note that this is just one representation of the UTxOs in your wallet. Over the next few weeks, we will take a close look at how UTxO work in Plutus and in front-end projects. For now, feel free to review this code and see how much sense it makes.
                            </Text>

                            {walletAssets.map((each) => <Box w='80%' mx='auto' p='5' my='3' border='1px'>{each.map((i) => (
                                <>
                                    <Text pt='3' fontSize='lg'>{i.policy} {i.unit}</Text>
                                    <Text pb='3' fontSize='lg'>Quantity: {i.quantity}</Text>
                                </>
                            ))}</Box>)}
                            <Heading py='5' size='lg'>And it can behave differently depending on which tokens you hold:</Heading>
                            <Flex direction='column' bg='white' py='10' justify='center'>
                                {ppblTokenHeld ? (
                                    <Box w='50%' minH='100px' mx='auto' p='3' bg='purple.800' color='white' fontSize='xl'>
                                        HELLO! This box is purple, and you will only see it if your connected wallet holds a PlutusPBLCourse01 token with the Policy ID: 3794c001b97da7a47823ad27b29e049985a9a97f8aa6908429180e2c
                                    </Box>
                                ) : (
                                    <Box w='50%' minH='100px' mx='auto' p='3' bg='orange.200' color='black' fontSize='xl'>
                                        HELLO! This box is orange, you will only see it if your connected wallet does not hold a PlutusPBLCourse01 token with the Policy ID: 3794c001b97da7a47823ad27b29e049985a9a97f8aa6908429180e2c
                                    </Box>
                                )}
                            </Flex>


                        </Box>
                    )}

                </Box>

            </Flex>
        </>
    )
}

export default PPBLDapp;