import React from "react";

const Hero = ({children}) => {
    return (
        <div style={{ height: "100vh" }}>
            <div
                style={{
                    position: "relative",
                    placeItems: "center",
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default Hero;