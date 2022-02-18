import React, { useState, useEFfect } from 'react'
import { useStoreState } from "easy-peasy";
import { Center, Box, FormControl, FormLabel, Switch, Spacer, Flex, Heading, Text } from '@chakra-ui/react';

const AboutPage = ({unsigs}) => {

  return (
    <Box bg='gl-green' w='100%' py='12'>
      <title>About</title>
      <Box w='85%' mx='auto'>

        <Heading size='4xl' fontWeight='medium' color='gl-blue' pb='4'>
          about jukebox
        </Heading>
        <Flex w='40%' my='4' p='1' color='gl-blue' direction='column'>
        <Heading>
          More info
        </Heading>
        </Flex>
      </Box>
    </Box>
  )
}

export default AboutPage
