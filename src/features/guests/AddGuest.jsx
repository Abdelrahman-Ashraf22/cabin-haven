import Button from "../../ui/Button";
import CreateGuestForm from "./CreateGuestForm";
import Modal from "../../ui/Modal";
import { Fragment } from "react";

function AddGuest() {
  return (
    <Fragment>
      <Modal>
        <Modal.Open opens="guest-form">
          <Button>+ New Guest</Button>
        </Modal.Open>
        <Modal.Window name="guest-form">
          <CreateGuestForm />
        </Modal.Window>
      </Modal>
    </Fragment>
  );
}

export default AddGuest;
