import React from "react";

const Hero = ({children}) => {
    return (
        <div 
            style={{ 
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",             
            }}>
            {children}
        </div>
    )
}

export default Hero;