import React from "react";

const Hero = ({children}) => {
    return (
        <div
            style={{
                height: "50vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#232129",
            }}>
            {children}
        </div>
    )
}

export default Hero;