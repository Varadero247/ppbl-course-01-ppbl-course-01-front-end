import React, { useState, useEffect } from "react";

import Unsig from "../Unsig/Unsig";

// Build the inefficient version first, then refactor

const UnsigOrderedScrollList = (props) => {
    // use props.start for filtering?
    // user input search / start -- "search" is also a boolean state
    // use props.num in some way?

    // pageSize arithmetic to get the first image - conditions?
    // or load individual numbers up to page size?

    // or should we be doing all of this with just index numbers?

    let firstPage = 0;
    if (props.start) firstPage = props.start

    let pageSize = 10;
    if (props.size) pageSize = props.size

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(firstPage);
    const [unsigUrl, setUnsigUrl] = useState(`http://localhost:8088/api/v1/unsigs?pageNo=${currentPage}&pageSize=${pageSize}`)

    // append newly loaded objects to array
    const [loadedUnsigs, setLoadedUnsigs] = useState([])

    const handleLoadMore = () => {
        setLoading(true)
    };

    // keep track of our latest query

    // How to control scroll behavior? Animation?

    useEffect(() => {
        if (loading) {
            setCurrentPage(currentPage+1)
            setLoading(false)    
        }
    }, [loading]);

    useEffect(() => {
        setUnsigUrl(`http://localhost:8088/api/v1/unsigs?pageNo=${currentPage}&pageSize=${pageSize}`)
    }, [currentPage])

    // useEffect that is called every time unsigUrl changes
    useEffect(() => {
        const alreadyLoaded = loadedUnsigs;
        fetch(unsigUrl)
            .then(response => response.json())
            .then(result => {
                setLoadedUnsigs([...alreadyLoaded, ...result.resultList])
            })
    }, [unsigUrl]);

    return(
        <>
            {loadedUnsigs.map((i) => (<Unsig key={i.details.index} number={i.details.index} />))}
            <button onClick={handleLoadMore}>LOAD MORE</button>
        </>
    )
};

export default UnsigOrderedScrollList;