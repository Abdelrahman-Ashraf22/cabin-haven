import styled from "styled-components";
import {
  HiArrowDownOnSquareStack,
  HiEye,
  HiPencil,
  HiSquare2Stack,
  HiTrash,
} from "react-icons/hi2";

import { useDeleteCabin } from "./useDeleteCabin";
import { useCreateCabin } from "./useCreateCabin";
import CreateCabinForm from "./CreateCabinForm";

import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

import { formatCurrency } from "../../utils/helpers";
import { screenSizes, windowSizes } from "../../utils/constants";
import CabinDetails from "./CabinDetails";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";

const Img = styled.img`
  display: block;
  width: 12rem;
  height: 4%.5;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";

  @media (max-width: ${screenSizes.tablet}) {
    font-size: 1.8rem;
  }
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;

  @media (max-width: ${screenSizes.tablet}) {
    margin-top: 0.5rem;
    font-size: 1.6rem;
  }
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);

  @media (max-width: ${screenSizes.tablet}) {
    font-size: 1.5rem;
  }
`;

function CabinRow({ cabin, isLoading }) {
  // To handle the delete function
  const { isDeleting, deleteCabin } = useDeleteCabin();

  // To handle the create function
  const { isCreating, createCabin } = useCreateCabin();

  // Redirecting
  const navigate = useNavigate();

  // Destructuring these values from the cabin object
  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;

  // Getting the width property from useWindowSize custom hook
  const { width } = useWindowSize();

  // Duplicate the cabin
  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
      description,
    });
  }

  return (
    //Big screens
    <Fragment>
      {width >= windowSizes.tablet ? (
        <Table.Row>
          <Img src={image} alt={name} />
          <Cabin>{name}</Cabin>
          <div> {maxCapacity} guests</div>
          <Price>{formatCurrency(regularPrice)}</Price>
          {discount ? (
            <Discount>{formatCurrency(discount)}</Discount>
          ) : (
            <span>&mdash;</span>
          )}
          <div>
            <Modal>
              <Menus.Menu>
                <Menus.Toggle id={cabinId} />

                <Menus.List id={cabinId}>
                  <Modal.Open opens="cabin-details">
                    <Menus.Button icon={<HiEye />}>See Details</Menus.Button>
                  </Modal.Open>

                  <Menus.Button
                    icon={<HiArrowDownOnSquareStack />}
                    onClick={() => navigate(`/bookings/new/${cabinId}`)}
                    disabled={isCreating}
                  >
                    Book Cabin
                  </Menus.Button>

                  <Menus.Button
                    icon={<HiSquare2Stack />}
                    onClick={handleDuplicate}
                    disabled={isCreating}
                  >
                    Duplicate
                  </Menus.Button>

                  <Modal.Open opens="edit-cabin">
                    <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                  </Modal.Open>

                  <Modal.Open opens="delete">
                    <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                  </Modal.Open>
                </Menus.List>

                <Modal.Window name="edit-cabin">
                  <CreateCabinForm cabinToEdit={cabin} />
                </Modal.Window>

                <Modal.Window name="cabin-details">
                  <CabinDetails cabin={cabin} />
                </Modal.Window>

                <Modal.Window name="delete">
                  <ConfirmDelete
                    resourceName="cabins"
                    disabled={isDeleting}
                    onConfirm={() => deleteCabin(cabinId)}
                  />
                </Modal.Window>
              </Menus.Menu>
            </Modal>
          </div>
        </Table.Row>
      ) : (
        // Small Screens
        <Table.Row>
          <Fragment>
            <Modal>
              <Menus.Menu>
                <Menus.Toggle id={cabinId} />

                <Menus.List id={cabinId}>
                  <Modal.Open opens="cabin-details">
                    <Menus.Button icon={<HiEye />}>See Details</Menus.Button>
                  </Modal.Open>

                  <Menus.Button
                    icon={<HiArrowDownOnSquareStack />}
                    onClick={() => navigate(`/bookings/new/${cabinId}`)}
                    disabled={isCreating}
                  >
                    Book Cabin
                  </Menus.Button>

                  <Menus.Button
                    icon={<HiSquare2Stack />}
                    onClick={handleDuplicate}
                    disabled={isCreating}
                  >
                    Duplicate
                  </Menus.Button>

                  <Modal.Open opens="edit-cabin">
                    <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                  </Modal.Open>

                  <Modal.Open opens="delete">
                    <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                  </Modal.Open>
                </Menus.List>

                <Modal.Window name="edit-cabin">
                  <CreateCabinForm cabinToEdit={cabin} />
                </Modal.Window>

                <Modal.Window name="cabin-details">
                  <CabinDetails cabin={cabin} isLoading={isLoading} />
                </Modal.Window>

                <Modal.Window name="delete">
                  <ConfirmDelete
                    resourceName="cabins"
                    disabled={isDeleting}
                    onConfirm={() => deleteCabin(cabinId)}
                  />
                </Modal.Window>
              </Menus.Menu>
            </Modal>
          </Fragment>

          <Cabin> Cabin {name}</Cabin>
          <div> {maxCapacity} guests</div>
          <Price>{formatCurrency(regularPrice)}</Price>
          {discount ? (
            <Discount>{formatCurrency(discount)}</Discount>
          ) : (
            <span>&mdash;</span>
          )}
        </Table.Row>
      )}
    </Fragment>
  );
}

export default CabinRow;
