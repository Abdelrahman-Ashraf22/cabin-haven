import CabinTable from "../features/cabins/CabinTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddCabin from "../features/cabins/AddCabin";
import CabinTableOperations from "../features/cabins/CabinTableOperations";
import { Fragment } from "react";

function Cabins() {
  return (
    <Fragment>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <AddCabin />
        <CabinTableOperations />
      </Row>

      <Row>
        <CabinTable />
      </Row>
    </Fragment>
  );
}

export default Cabins;
