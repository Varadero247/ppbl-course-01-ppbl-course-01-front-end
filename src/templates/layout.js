import React from "react";
import { StoreProvider } from "easy-peasy";
import store from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";


// import { flexbox } from "@chakra-ui/styled-system";
import { Box, ChakraProvider, extendTheme, Flex } from '@chakra-ui/react'

const theme = extendTheme({
    colors: {
        "gl-blue": "#2a4676",
        "gl-green": "#a3b79b",
        "gl-red": "#b53d46",
        "gl-yellow": "#fde0a8"
    },
    fonts: {
        heading: 'JetBrains Mono',
        body: 'Poppins',
    },
})

const Layout = (props) => {
    return (
        <StoreProvider store={store}>
            <ChakraProvider theme={theme}>
                <Flex w="100%" minHeight="100vh" bg="gl-blue">
                    <Header />
                    {props.children}
                    <Footer />
                </Flex>
            </ChakraProvider>
        </StoreProvider>
    )
}

export default Layout;