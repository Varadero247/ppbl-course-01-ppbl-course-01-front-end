import React from "react";
import { Link } from "gatsby"
import { useStoreState } from "easy-peasy";
import { Box, Flex, Spacer } from "@chakra-ui/react";

import WalletButton from "../WalletButton/WalletButton";


const Header = () => {
    const connected = useStoreState((state) => state.connection.connected);

    return (
        <Box id="header" w='20%' h='10%' p='5' bg='gl-blue' color='white'>
            <Flex direction='column' align='center' justify='center'>
                <Box my='10' fontWeight='bold'>
                    <Link to="/">home</Link>
                </Box>
                <Box my='10' fontWeight='bold'>
                    <Link to="/dashboard/">dashboard</Link>
                </Box>
                <Box my='10' fontWeight='bold'>
                    <Link to="/about/">about</Link>
                </Box>
                <WalletButton />
            </Flex>
        </Box>
    )
}

export default Header;