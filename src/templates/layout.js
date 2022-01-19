import React from "react";
import { StoreProvider } from "easy-peasy";
import store from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";


// import { flexbox } from "@chakra-ui/styled-system";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    colors: {},
    fonts: {
        heading: 'JetBrains Mono',
        body: 'Poppins',
    },
})

const Layout = (props) => {
    return (
        <StoreProvider store={store}>
            <ChakraProvider theme={theme}>
                <div style={{ width: "100%" }}>
                    <Header />
                    {props.children}
                    <Footer />
                </div>
            </ChakraProvider>
        </StoreProvider>
    )
}

export default Layout;