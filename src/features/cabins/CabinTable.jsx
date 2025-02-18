import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";
import Pagination from "../../ui/Pagination";

function CabinTable() {
  // Getting these functions from the useCabins custom hook
  const { isLoading, cabins, error, count } = useCabins();

  // Using the searchParams for checking
  const [searchParams] = useSearchParams();

  // If is loading return the spinner
  if (isLoading) return <Spinner />;
  // If there is any error throw this msg
  if (error) throw new Error("Couldn't load cabins");
  //If there is no cabins return the Empty msg
  if (!cabins.length) return <Empty resourceName="cabins" />;

  // Filter based on discount
  const filterValue = searchParams.get("discount") || "all";

  // Filtering
  let filteredCabins;
  if (filterValue === "all") filteredCabins = cabins;

  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);

  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  const sortBy = searchParams.get("sortBy") || "name-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  // Sort the cabins based on the name
  const sortedCabins =
    field === "name"
      ? filteredCabins.sort(
          (a, b) => a[field].localeCompare(b[field]) * modifier
        )
      : filteredCabins.sort((a, b) => (a[field] - b[field]) * modifier);

  return (
    <Menus>
      <Table columns="0.6fr 1.9fr 2.2fr 1fr 1fr 1fr" mobilecolumns="1fr">
        <Table.Header>
          <div>Picture</div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => (
            <CabinRow cabin={cabin} key={cabin.id} isLoading={isLoading} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default CabinTable;
