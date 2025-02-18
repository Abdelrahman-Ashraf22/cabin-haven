import DashboardLayout from "../features/dashboard/DashboardLayout";
import DashboardFilter from "../features/dashboard/DashboardFilter";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { RxDashboard } from "react-icons/rx";
import { Fragment } from "react";

function Dashboard() {
  return (
    <Fragment>
      <Row type="horizontal">
        <Heading as="h1">
          <RxDashboard />
          Dashboard
        </Heading>
        <DashboardFilter />
      </Row>

      <DashboardLayout />
    </Fragment>
  );
}

export default Dashboard;
