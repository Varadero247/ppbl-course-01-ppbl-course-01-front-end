import React from "react";
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image";
import styled from "styled-components";

import WalletButton from "../WalletButton/WalletButton";

const Header = () => {
    return(
        <div id="header"
            style={{
                height: "2%",
                padding: "2%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#162da1",
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
                    <Link to="/explore/">Explore</Link> 
                </NavButton>
                <NavButton>
                    <Link to="/marketplace/">Marketplace</Link> 
                </NavButton>
                <NavButton>
                    <Link to="/collection/">My Collection</Link> 
                </NavButton>
                <NavButton>
                    <Link to="/explore/">Guide</Link>                
                </NavButton>
                <WalletButton />
            </div>
        </div>
    )
}

const NavButton = styled.div`
    margin: 0px 50px 0px 0px;
    font-weight: bold;
`

export default Header;