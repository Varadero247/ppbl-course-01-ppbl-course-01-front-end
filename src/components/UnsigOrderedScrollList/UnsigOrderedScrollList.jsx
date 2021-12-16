import React, { useState, useEffect } from "react";
import { Button, Box, Center, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from "@chakra-ui/react";
import { Formik, useFormik } from 'formik';
import styled from "styled-components";


import Unsig from "../Unsig/Unsig";
import { valueToAssets } from "../../cardano/transaction";

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

    let pageSize = 12;
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
    const formik = useFormik({
        initialValues: {
            searching: 0,
        },
    })

    useEffect(() => {
        if (loading) {
            setCurrentPage(currentPage+1)
            setLoading(false)    
        }
    }, [loading]);

    useEffect(() => {
        const n = formik.values.searching;
        setLoadedUnsigs([]);
        setUnsigUrl(`http://localhost:8088/api/v1/unsigs?pageNo=${n}&pageSize=${pageSize}`)
    }, [formik.values.searching])

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
            <Center h='100px' w='50%'>    
                <form>
                    <label>Search:</label>
                    <input name="searching" onChange={formik.handleChange} value={formik.values.searching} />
                </form>
                <h1>
                    {formik.values.searching}
                </h1>
            </Center>
            <Collection>
                {loadedUnsigs.map((i) => (<Unsig key={i.details.index} number={i.details.index} />))}
            </Collection>
            <Center display='flex' w='100%'>
                <Button onClick={handleLoadMore}>LOAD MORE</Button>
            </Center>
        </>
    )
};

export default UnsigOrderedScrollList;

const Collection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`