import React from "react";
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image";
import styled from "styled-components";

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
                <StaticImage src="../../images/unsig.svg" width={300} />
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
                    <Link to="/explore/">Guide</Link>                
                </NavButton>
                <NavButton>
                    <Link to="/explore/">More</Link>                 
                </NavButton>
            </div>
        </div>
    )
}

const NavButton = styled.div`
    margin: 0px 50px 0px 0px;
    font-weight: bold;
    
`

export default Header;