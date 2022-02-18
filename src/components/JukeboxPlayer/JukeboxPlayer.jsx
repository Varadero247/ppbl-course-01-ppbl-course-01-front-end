import { Flex, Box, Text, Button } from "@chakra-ui/react";
import React from "react";
import { splitJukeboxTokens } from "../../cardano/split-jukebox-tokens";
import { fromBech32 } from "../../utils/converter";


const JukeboxPlayer = (props) => {

    const handlePlaySong = async () => {
        console.log("click")
        const musicFan = { "address": fromBech32(props.address), "utxosParam": props.utxos }
        const txHash = await splitJukeboxTokens(musicFan)
        console.log(txHash)
    }

    return(
        <Flex id='JukeboxPlayer' width='100%' p='5' justify='center' bg='white' color='gl-blue'>
            <Box bg='gl-green' mx='5' p='5'>
                <Text>tJ balance: {props.tokens}</Text>
            </Box>
            <Box bg='gl-blue' color='white' mx='5' p='5'>
                <Text>Play a song for 10 tJ tokens</Text>
                <Button color='gl-blue' onClick={handlePlaySong}>Play Button</Button>
            </Box>
        </Flex>
    )
}

export default JukeboxPlayer;