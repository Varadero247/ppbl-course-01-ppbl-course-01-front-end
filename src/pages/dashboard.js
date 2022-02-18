import React, { useState, useEffect } from "react"
import Cardano from "../cardano/serialization-lib"
import Wallet from "../cardano/wallet"
import { serializeTxUnspentOutput, valueToAssets } from "../cardano/transaction"
import { unsigPolicyId } from "../cardano/market-contract"
import { fromHex, toStr } from "../utils/converter"
import { useStoreActions, useStoreState } from "easy-peasy";

import { Box, Heading, Text, Flex } from "@chakra-ui/react"
import useWallet from "../hooks/useWallet"

const DashboardPage = () => {
    const connected = useStoreState((state) => state.connection.connected);
    const [collection, setCollection] = useState([]);
    const { wallet } = useWallet(null);

    return (
        <Box w='100%' minH='800px' px='24' py='12' bg='gl-green' color='gl-blue'>
            <title>collection</title>
            <Box>
                <Heading size='4xl' fontWeight='medium'>
                    Dashboard
                </Heading>
                {connected ? (
                    <Box>
                        <Heading py='5'>
                            We can experiment with dashboard features here.
                        </Heading>
                        <Text py='3'>
                            {connected}
                        </Text>
                        <Text py='3'>
                            For example, a list of transactions resulting from pressing "Play"
                        </Text>
                    </Box>

                ) : (
                    <Box>
                        <Text fontSize='xl' py='3'>
                            To view your dashboard, please connect a wallet.
                        </Text>
                    </Box>
                )}

            </Box>

        </Box>
    )
}

export default DashboardPage