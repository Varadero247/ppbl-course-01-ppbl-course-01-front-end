import React from "react";
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image";
import styled from "styled-components";
import { useStoreState } from "easy-peasy";

import WalletButton from "../WalletButton/WalletButton";

const Header = () => {
    const connected = useStoreState((state) => state.connection.connected);

    return (
        <div id="header"
            style={{
                height: "2%",
                padding: "2%",
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                // backgroundColor: "#162da1",
                backgroundColor: "#232129",
                color: "#FFF",
            }}
        >
            <div>
                <Link to="/">
                    <StaticImage src="../../images/unsig.svg" width={300} alt="logo" />
                </Link>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <NavButton>
                    <Link to="/marketplace/">marketplace</Link>
                </NavButton>

                <NavButton>
                    <Link to="/guide/">guide</Link>
                </NavButton>
                <NavButton>
                    <Link to="/about/">about</Link>
                </NavButton>
                <WalletButton />
            </div>
        </div>
    )
}

const NavButton = styled.div`
    margin: 0px 50px 0px 0px;
    font-weight: bold;
    font-family: 'JetBrains Mono';
`

export default Header;