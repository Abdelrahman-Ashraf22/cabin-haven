import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import AddBooking from "../features/bookings/AddBooking";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { Fragment } from "react";

function Bookings() {
  return (
    <Fragment>
      <Row type="horizontal">
        <Heading as="h1">
          <span>
            <HiOutlineCalendarDays />
          </span>
          Bookings
        </Heading>
        <AddBooking />
        <BookingTableOperations />
      </Row>

      <BookingTable />
    </Fragment>
  );
}

export default Bookings;
