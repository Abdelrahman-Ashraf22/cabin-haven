import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

import { useBooking } from "../bookings/useBooking";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useSettings } from "../settings/useSettings";
import { useCheckin } from "./useCheckin";

import { formatCurrency } from "../../utils/helpers";
import { screenSizes } from "../../utils/constants";

import { HiOutlineArrowDownOnSquareStack } from "react-icons/hi2";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;

  @media (max-width: ${screenSizes.tablet}) {
    gap: 1rem;
    align-items: flex-end;
  }
`;

function CheckinBooking() {
  // Paid state
  const [confirmPaid, setConfirmPaid] = useState(false);
  // Breakfast state
  const [addBreakfast, setAddBreakfast] = useState(false);

  // Getting the booking to show the details of the booked
  const { booking, isLoading } = useBooking();
  // Getting the settings to handle the calculate the optionalBreakfastPrice
  const { settings, isLoading: isLoadingSettings } = useSettings();

  // Go to the precious page using the useMoveBack custom hook
  const moveBack = useMoveBack();

  // Getting the check-in custom hook
  const { checkin, isCheckingIn } = useCheckin();

  // The default value of the payment is fales
  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking]);

  // if it is loading return the spinner
  if (isLoading || isLoadingSettings) return <Spinner />;

  // Destructuring these data from the booking object
  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numNights * numGuests;

  function handleCheckin() {
    //if the payment is not confirmed return nothing
    if (!confirmPaid) return;

    // if the guest add a breackfast add the extra price then calculate the total price
    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extraPrice: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkin({ bookingId, breakfast: {} });
    }
  }

  return (
    <Fragment>
      <div className="button-back">
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </div>

      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h5">
            <span>
              <HiOutlineArrowDownOnSquareStack />
            </span>
            Check in booking #{bookingId}
          </Heading>
        </HeadingGroup>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          disabled={confirmPaid || isCheckingIn}
          id="confirm"
        >
          I confirm that {guests.fullName} has paid the total amount{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
      </ButtonGroup>
    </Fragment>
  );
}

export default CheckinBooking;
