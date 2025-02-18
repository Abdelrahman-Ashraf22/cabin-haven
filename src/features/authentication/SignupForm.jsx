/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import { useForm } from "react-hook-form";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import Input from "../../ui/Input";

import { useSignup } from "./useSignup";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate } from "react-router-dom";
import SpinnerMini from "../../ui/SpinnerMini";

function SignupForm() {
  // Getting these functions from the useSignup custom hook
  const { signup, isLoading } = useSignup();

  // Getting these functions from the react-hook-form ==> "useForm"
  const { register, formState, getValues, handleSubmit, reset } = useForm();

  // Destructuring the errors object from formState function
  const { errors } = formState;

  // The submit function excutes the signup method using the parameters then will reset the input fields at the end navigate to the login page
  function onSubmit({ fullName, email, password }) {
    signup(
      { fullName, email, password },
      {
        onSettled: () => {
          reset(), navigate("/login");
        },
      }
    );
  }

  // navigate to the previous page
  const moveBack = useMoveBack();

  // redirecting to...
  const navigate = useNavigate();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          {...register("fullName", { required: "This field is required" })}
          disabled={isLoading}
        />
      </FormRowVertical>

      <FormRowVertical label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address",
            },
          })}
          disabled={isLoading}
        />
      </FormRowVertical>

      <FormRowVertical
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
          disabled={isLoading}
        />
      </FormRowVertical>

      <FormRowVertical
        label="Repeat password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "The passwords do not match",
          })}
          disabled={isLoading}
        />
      </FormRowVertical>

      <FormRowVertical>
        <Button disabled={isLoading}>
          {!isLoading ? "Sign Up" : <SpinnerMini />}
        </Button>
        <Button
          variation="secondary"
          type="reset"
          disabled={isLoading}
          onClick={moveBack}
        >
          Cancel
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default SignupForm;
