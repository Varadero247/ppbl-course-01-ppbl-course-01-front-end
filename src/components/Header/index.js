import React from "react";
import { Link } from "gatsby"

const Header = () => {
    return(
        <div id="header"
            style={{
                height: "2%",
                margin: "2%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <p>Unsigs Marketplace</p>
            <Link to="/explore/">Explore</Link>
            <a>Learn More</a>
        </div>
    )
}

export default Header;