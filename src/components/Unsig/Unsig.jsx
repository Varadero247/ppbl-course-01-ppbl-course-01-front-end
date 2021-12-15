import React, { useState, useEffect } from "react";
import { motion } from "framer-motion" // for hover, if time

const unsigStyle = {
    display: "flex",
    flexDirection: "column",
    background: "#2e2e41",
    color: "white",
    margin: "1rem",
    padding: "1rem",
    boxShadow: "2px 2px 2px gray",
}

const imageStyle = {
    borderRadius: "2%",
    marginBottom: "1rem"
}

const detailRow = {
    display: "flex",
    flexDirection: "row",
    color: "white",
    margin: "1rem",
    padding: "1rem"
}

const numberStyle = {
    fontSize: "2rem"
}

// play with hover if time
// const unsigOverlayStyle = {
//     zIndex: 20,
//     padding: "1rem",
//     margin: "1rem",
//     fontSize: "1rem",
// }

function getImageURL (unsigID, resolution) {
// unsigID [0...31118]
// resolution [128, 256, 512, 1024, 2048]
    const unsigNumber = unsigID;
    const res = resolution;
    const imageURL = "https://s3-ap-northeast-1.amazonaws.com/unsigs.com/images/" + res + "/" + unsigNumber + ".png";
    return imageURL;
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}



const Unsig = (props) => {
// props.number 
// props.isOffered
    
// Todo: loading behavior


    // File under why I wish I knew TypeScript
    const emptyUnsig = {
        "unsigId": "",
        "details": {
            "index": 0,
            "num_props": 0,
            "properties": {
                "multipliers": [],
                "colors": [],
                "distributions": [],
                "rotations": []
            }
        }
    }

    const number = props.number
    const numString = pad(number,5)
    const iURL = getImageURL (numString, "1024")

    const [unsigDetails, setUnsigDetails] = useState(emptyUnsig);

    useEffect(() => {
        fetch(`http://localhost:8088/api/v1/unsigs/unsig${numString}`)
            .then(response => response.json())
            .then(resultData => {setUnsigDetails(resultData)})
    }, []);

    return(
        <motion.div 
            initial={{ opacity: 0, y: 50}} 
            whileInView={{ opacity: 1, y: 0}} 
            viewport={{ once: false }} 
            exit={{ opacity: 0, y: 50}}
        >
            <div style={unsigStyle}>
                <div>
                    {/* not sure why Gatsby's StaticImage doesn't work here, this is ok for now */}
                    <motion.div initial={{ opacity: 0}} animate={{ opacity: 1 }} transition={{ duration: 3 }}>
                        <img src={iURL} alt="unsig" width={256} height={256} style={imageStyle} />
                    </motion.div>
                    <p style={numberStyle}>
                        # {unsigDetails.details.index}
                    </p>
                </div>

                <div>
                    <p>
                        {(props.isOffered) ? ("for sale") : ("not for sale")}
                    </p>
                </div>
                <div>
                    <p style={numberStyle}>
                        {unsigDetails.details.num_props}
                    </p>
                </div>
                <div>
                    <p style={{fontSize: "0.8rem"}}>
                        PROPERTIES
                    </p>
                </div>

            </div>
        </motion.div>
    );
}

export default Unsig