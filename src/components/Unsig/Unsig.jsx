import React, { useState, useEffect } from "react";
import { motion } from "framer-motion" // for hover, if time

const unsigStyle = {
    display: "flex",
    flexDirection: "column",
    background: "#2037d9",
    color: "white",
    margin: "1rem",
    padding: "1rem",
    width: "20rem",
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
    console.log(imageURL);
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
        <div>
            <div style={unsigStyle}>
                {/* not sure why Gatsby's StaticImage doesn't work here, this is ok for now */}
                <img src={iURL} alt="unsig" width={500} />
                <div>
                    <p>
                        {unsigDetails.details.index}
                    </p>
                    <p>
                        {unsigDetails.details.num_props} properties
                    </p>
                    <p>
                        {(props.isOffered) ? ("for sale") : ("not for sale")}
                    </p>
                    <div>{unsigDetails.unsigId}</div>
                    <div>{unsigDetails.details.properties.colors}</div>
                    <div>{unsigDetails.details.properties.rotations}</div>
                </div>
            </div>
        </div>
    );
}

export default Unsig