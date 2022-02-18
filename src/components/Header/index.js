import React from "react";
import { Link } from "gatsby"
import { useStoreState } from "easy-peasy";
import { Box, Flex, Spacer } from "@chakra-ui/react";

import WalletButton from "../WalletButton/WalletButton";


const Header = () => {
    const connected = useStoreState((state) => state.connection.connected);

    return (
        <Box id="header" w='40%' h='5%' mx='auto' p='5' bg='gl-blue' color='white'>
            <Flex direction='row' align='center' justify='center'>
                <Box my='10' fontWeight='bold'>
                    <Link to="/">home</Link>
                </Box>
                <Spacer />
                <WalletButton />
            </Flex>
        </Box>
    )
}

export default Header;