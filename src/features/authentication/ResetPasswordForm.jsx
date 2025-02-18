import { useState } from "react";
import toast from "react-hot-toast";

import { useResetPassword } from "./useResetPassword";
import { useMoveBack } from "../../hooks/useMoveBack";

import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";
import Button from "../../ui/Button";

function ResetPasswordForm() {
  // Getting these functions from the useResetPassword custom hook
  const { resetPassword, isLoading } = useResetPassword();

  // Declaring a variable then use the useMoveBack custom hook to navigate to the previous page
  const moveBack = useMoveBack();

  // Handling the email input field through a useState hook
  const [email, setEmail] = useState("");

  // e => prevent the default action of the submit button
  // The submit function if there is no email return this msg in a toast else use the "resetPassword" function with the argument email => the value of the input that the user will enter it
  function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    resetPassword(email);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          placeholder="Please enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button disabled={isLoading}>
          {isLoading ? <SpinnerMini /> : "Reset password"}
        </Button>
        <Button type="button" variation="secondary" onClick={moveBack}>
          Cancel
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default ResetPasswordForm;
