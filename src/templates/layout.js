import React from "react";
import { StoreProvider } from "easy-peasy";
import store from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "@fontsource/poppins";

const Layout = (props) => {
    return (
        <StoreProvider store={store}>
            <div style={{ width: "100%" }}>
                <Header />
                {props.children}
                <Footer />
            </div>
        </StoreProvider>
    )
}

export default Layout;