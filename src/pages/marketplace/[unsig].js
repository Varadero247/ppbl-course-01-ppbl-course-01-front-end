import * as React from "react"
import { UnsigPageLayout } from "../../components/UnsigPageLayout";

const pageStyles = {
    color: "#232129",
    width: "100%",
  }

function UnsigPage(props) {
  const unsig = props.params.unsig;

  return(
    <div style={pageStyles}>
      <UnsigPageLayout number={unsig} />
    </div>
  )
}

export default UnsigPage;