import React from "react";

const Footer = () => {
    return(
        <div id="footer"
            style={{
                height: "2%",
                margin: "2%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <p>Unsigs Marketplace</p>
            <a>Explore</a>
            <a>Learn More</a>
        </div>
    )
}

export default Footer;