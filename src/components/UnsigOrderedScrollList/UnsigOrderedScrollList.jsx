import React, { useState, useEffect } from "react";
import { Button, Box, Center, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input } from "@chakra-ui/react";
import { Formik, useFormik } from 'formik';
import styled from "styled-components";

import { UnsigCard } from "../UnsigCard"

const UnsigOrderedScrollList = (props) => {

    const numPerPage = 20;

    const [loading, setLoading] = useState(false);
    const [listUnsigs, setListUnsigs] = useState(["unsig00000"]);
    const [loadedUnsigData, setLoadedUnsigData] = useState(null);

    const handleLoadMore = () => {
        setLoading(true)
    };

    // How to control scroll behavior? Animation?
    const formik = useFormik({
        initialValues: {
            searching: 0,
        },
    })

    useEffect(() => {
        if (loading) {
            setLoading(false)
        }
    }, [loading]);

    // convert number to 5-digit string with leading 0's if needed
    function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
    }

    // create an array of stings of the form "unsig#####"
    const buildArray = (start, quantity) => {
        let result = [];
        let iter = start;
        while (result.length < quantity){
            const numString = pad(iter, 5);
            result.push("unsig"+numString)
            iter++;
        }
        return result;
    }

    // when searching, adjust the list of Unsig IDs in array
    useEffect(() => {
        const n = formik.values.searching;
        setListUnsigs(buildArray(n, numPerPage));
    }, [formik.values.searching])

    // get the data
    useEffect(async () => {
        const n = formik.values.searching;
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(listUnsigs)
        }
        const response = await fetch('http://localhost:8088/api/v1/unsigs/find', requestOptions)
        const data = await response.json();
        setLoadedUnsigData(data.resultList)
        console.log("loaded", loadedUnsigData)
    }, [listUnsigs])

    return(
        <>
            <Box w='300px' ml='25px'>
                <form>
                    <Input size='lg' placeholder='search for unsig' name="searching" onChange={formik.handleChange} value={formik.values.searching} />
                </form>
            </Box>
            {(!loadedUnsigData) ?
                ("loading") : (
                    <Collection>
                        {loadedUnsigData.map((i) => (<UnsigCard number={i.details.index} numProps={i.details.num_props} />))}
                    </Collection>
                )
            }
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