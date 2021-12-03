import React from "react";

const Section = ({children}) => {
    return (
        <div 
            style={{ 
                height: "50vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",             
            }}>
            {children}
        </div>
    )
}

export default Section;