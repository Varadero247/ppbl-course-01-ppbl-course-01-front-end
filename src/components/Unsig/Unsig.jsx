import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"

const unsigStyle = {
    display: "flex",
    flexDirection: "column",
    background: "#2037d9",
    color: "white",
    margin: "1rem",
    padding: "1rem",
    width: "20rem",
}

const unsigOverlayStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 20,
    color: "white",
    padding: "0.5rem",
    margin: "0.5rem",
    fontSize: "3rem",
}

// mouse over to see details would be really cool 
// use framer motion to acheive this?

const Unsig = (props) => {
    return(
        <div>
            <div style={unsigStyle}>    
                <img src={props.unsigImg} alt="unsig" />
            </div>
            <motion.div style={unsigOverlayStyle} initial={{ opacity: 0 }} whileHover={{ opacity: 100 }} transition={{ duration: 1 }} onHoverStart={e => {}} onHoverEnd={e => {}}>
                <p>
                    {props.number}
                </p>
                <p>
                    {props.properties} properties
                </p>
            </motion.div>
        </div>
    );
}

export default Unsig