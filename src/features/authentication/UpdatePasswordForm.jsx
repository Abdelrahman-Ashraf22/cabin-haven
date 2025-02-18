import { useForm } from "react-hook-form";

import { useUpdateUser } from "./useUpdateUser";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import toast from "react-hot-toast";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useLogout } from "./useLogout";
import { useWindowSize } from "../../hooks/useWindowSize";
import { windowSizes } from "../../utils/constants";
import FormRowVertical from "../../ui/FormRowVertical";
import ButtonGroup from "../../ui/ButtonGroup";
import { Fragment } from "react";

function UpdatePasswordForm() {
  // Getting these functions from the react-hook-form ==> useForm
  const { register, handleSubmit, formState, getValues, reset } = useForm();

  // Destructuring the errors object from formState function
  const { errors } = formState;

  // Getting these functions from the useUpdateUser react custom hook
  const { updateUser, isUpdating } = useUpdateUser();

  // Getting these functions from the useLogout custom hook
  const { logout, isLoading: isDeleting } = useLogout();

  // The width property from the custom hook useWindowSize
  const { width } = useWindowSize();

  // The submit function will update the password that the user will enter it
  // Then a msg will be shown in a toast
  // finally the onSettled will reset the inputs whether the values are correct or not
  function onSubmit({ password }) {
    updateUser(
      { password },
      {
        onSuccess: () => toast.success("Password was successfully updated"),
        onSettled: () => reset(),
      }
    );
  }

  // Deleting the account then logout finally show a success msg in a toast
  function handleDeleteAccount() {
    logout();
    toast.success("Account was successfully deleted. Hope to see you soon!");
  }

  // here we check if the width property is greater that the tablet "Big screens"
  return width >= windowSizes.tablet ? (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          label="New Password (min 8 characters)"
          error={errors?.password?.message}
        >
          <Input
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={isUpdating}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password needs a minimum of 8 characters",
              },
            })}
          />
        </FormRow>

        <FormRow
          label="Confirm password"
          error={errors?.passwordConfirm?.message}
        >
          <Input
            type="password"
            autoComplete="new-password"
            id="passwordConfirm"
            disabled={false}
            {...register("passwordConfirm", {
              required: "This field is required",
              validate: (value) =>
                getValues().password === value || "Passwords need to match",
            })}
          />
        </FormRow>
        <FormRow>
          <ButtonGroup>
            <Button onClick={reset} type="reset" variation="secondary">
              Cancel
            </Button>
            <Button disabled={false}>Update password</Button>
          </ButtonGroup>
        </FormRow>
      </Form>
      <FormRow>
        Do you want to delete your account?
        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete Account</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="account"
              disabled={isDeleting}
              onConfirm={() => {
                handleDeleteAccount();
              }}
            />
          </Modal.Window>
        </Modal>
      </FormRow>
    </Fragment>
  ) : (
    // MOBILE
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRowVertical
          label="New Password (min 8 characters)"
          error={errors?.password?.message}
        >
          <Input
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={isUpdating}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password needs a minimum of 8 characters",
              },
            })}
          />
        </FormRowVertical>

        <FormRowVertical
          label="Confirm password"
          error={errors?.passwordConfirm?.message}
        >
          <Input
            type="password"
            autoComplete="new-password"
            id="passwordConfirm"
            disabled={isUpdating}
            {...register("passwordConfirm", {
              required: "This field is required",
              validate: (value) =>
                getValues().password === value || "Passwords need to match",
            })}
          />
        </FormRowVertical>
        <FormRowVertical>
          <ButtonGroup>
            <Button onClick={reset} type="reset" variation="secondary">
              Cancel
            </Button>
            <Button disabled={isUpdating}>Update password</Button>
          </ButtonGroup>
        </FormRowVertical>
      </Form>
      <FormRow>
        Do you want to delete your account?
        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete Account</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="account"
              disabled={isDeleting}
              onConfirm={() => {
                handleDeleteAccount();
              }}
            />
          </Modal.Window>
        </Modal>
      </FormRow>
    </Fragment>
  );
}

export default UpdatePasswordForm;
