import * as React from "react"
import { UnsigPageLayout } from "../../components/UnsigPageLayout";
import { Box } from "@chakra-ui/react";

const pageStyles = {
    color: "#232129",
    width: "100%",
  }

function UnsigPage(props) {
  const unsig = props.params.unsig;

  return(
    <Box bg='#232129' minH='1200px'>
      <UnsigPageLayout number={unsig} />
    </Box>
  )
}

export default UnsigPage;