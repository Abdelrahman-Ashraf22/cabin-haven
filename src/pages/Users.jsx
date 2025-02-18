import { Fragment } from "react";
import SignupForm from "../features/authentication/SignupForm";
import Heading from "../ui/Heading";

function NewUsers() {
  return (
    <Fragment>
      <Heading as="h1">Create a new user</Heading>
      <SignupForm />
    </Fragment>
  );
}

export default NewUsers;
