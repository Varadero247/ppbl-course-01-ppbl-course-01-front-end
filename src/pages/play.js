import React, { useEffect, useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import Wallet from "../cardano/wallet";
import { fromAscii, fromHex, toStr } from "../utils/converter";
import { Flex, Center, Heading, Text, Box } from "@chakra-ui/react";
import useWallet from "../hooks/useWallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction";
import JukeboxPlayer from "../components/JukeboxPlayer/JukeboxPlayer";

// PPBL Weeks 2-3
// 1. Establish the concept of UTxO
// 2. Use compiled Plutus Script
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
    if(unit == "lovelace") {
        return ""
    }
    else {
        id = unit.slice(0,56)
    }
    return id
}

// given a hex-encoded Unit in a Value pair, return the asset name
function getTokenName(unit) {
    let name = ""
    if(unit == "lovelace") {
        return "ada"
    }
    else {
        let temp = fromHex(unit.substring(56))
        name = toStr(temp)
    }
    return name
}

// PPBL: Review how "Value" is defined in Plutus -- see how this data type works in and outside of Haskell
// Messaging: If we're going to talk about Minting native assets, we need to understand how Values work!
// given a hex-encoded Unit and Quantity in a Value pair,
function getQuantity(unit, quantity) {
    if(unit == "lovelace") {
        return quantity/1000000
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
            if ((asset.policy === policyId) && (asset.unit === name)){
                console.log("assets", asset.policy, "name", asset.unit)
                quantity = asset.quantity
            }
        })
    })
    return quantity
}

// What else can we do as exercises?
// How about a wallet summary that adds together

const PlayPage = () => {
    const connected = useStoreState((state) => state.connection.connected);
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletUtxos, setWalletUtxos] = useState([]);
    const [walletAssets, setWalletAssets] = useState([]);
    const [tjTokensHeld, setTjTokensHeld] = useState(0);
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

    // specific to Jukebox, get the number of tJ tokens in connected wallet
    useEffect(() => {
        setTjTokensHeld(walletHoldsThisAsset(walletAssets, "44d5cc3395e94e805a24085cf275647b32c9aa7839e4d6bb4fe10f05", "tJ"))
    }, [loading])


    return (
        <>
            <title>demo v0</title>
            <Flex w='80%' mx='auto' direction='column' wrap='wrap' bg='gl-yellow' p='10'>
                <Heading size='4xl' color='gl-blue' fontWeight='medium' py='5'>play</Heading>
                {loading ? (
                    <Box w="50%">
                        loading...
                    </Box>
                ) : (
                    <Box w='50%'>
                        {/* <Heading py='5'>Utxos</Heading> */}
                        {/* In PPBL, we may want to look at this raw UTXO representation */}
                        {/* <Heading py='5' size='lg'>UTxO Strings (hidden)</Heading> */}
                        <Box>
                            {walletUtxos.map(utxo =>
                                (<Text key={utxo} py='5'>{utxo}</Text>)
                                )}
                            </Box>
                        <Heading py='5' size='lg'>Human readable UTxOs:</Heading>

{walletAssets.map((each) => <Box p='5' my='3' border='1px'>{each.map((i) => <Text py='3'>{i.policy} | {i.unit} | {i.quantity}</Text>)}</Box>)}
                        <Heading py='5' size='lg'>Jukebox Player</Heading>
                        {tjTokensHeld ? (
                            <Box>
                                <JukeboxPlayer tokens={tjTokensHeld} address={walletAddress} utxos={walletUtxos} />
                            </Box>
                        ) : (
                            <Text>You need tJ tokens to play at this jukebox!</Text>
                        )}

                        <Heading py='5' size='md'>Connected Wallet Address</Heading>
                        <Text fontSize='sm'>{walletAddress}</Text>

                    </Box>
                )}

            </Flex>
        </>
    )
}

export default PlayPage;