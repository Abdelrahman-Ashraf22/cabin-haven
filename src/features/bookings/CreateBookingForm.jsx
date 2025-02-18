import { useEffect } from "react";
import "react-day-picker/style.css";

import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

import { useCreateBookings } from "./useCreateBookings";
import { useSettings } from "../settings/useSettings";
import { useAllCabins } from "../cabins/useAllCabins";
import { useAllGuests } from "../guests/useAllGuests";
import { useAvailability } from "./useAvailability";
import { useGetBookingsByCabin } from "./useGetBookingsByCabin";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Row from "../../ui/Row";
import FormRow from "../../ui/FormRow";
import FormRowVertical from "../../ui/FormRowVertical";
import Spinner from "../../ui/Spinner";
import Select from "../../ui/Select";
import Checkbox from "../../ui/Checkbox";
import ButtonText from "../../ui/ButtonText";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import PopoverContent from "../../ui/PopoverContent";
import FooterDatePicker from "../../ui/FooterDatePicker";
import MessageAvailable from "./MessageAvailable";

import {
  isBefore,
  isValid,
  parseISO,
  format,
  eachDayOfInterval,
  startOfToday,
  endOfDay,
} from "date-fns";

import {
  HiOutlineSquare3Stack3D,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";

import { ArrowContainer, Popover } from "react-tiny-popover";
import { DayPicker } from "react-day-picker";

import { useMoveBack } from "../../hooks/useMoveBack";
import { formatCurrency, subtractDates } from "../../utils/helpers";
import { usePopover } from "../../hooks/usePopover";
import { useDatePicker } from "../../hooks/useDatePicker";
import { useWindowSize } from "../../hooks/useWindowSize";
import { modifiersStylesDatePicker, windowSizes } from "../../utils/constants";

function CreateBookingForm() {
  // Getting these functions from useCreateBookings custom hook
  const { createBooking, isLoading: isCreating } = useCreateBookings();

  // Getting these functions from useSettings custom hook
  const { settings, isLoading: isLoadingSettings } = useSettings();

  // Getting these functions from useAllCabins custom hook
  const { cabins, isLoading: isLoadingCabins } = useAllCabins();

  // Getting these functions from useAllGuests custom hook
  const { guests, isLoading: isLoadingGuests } = useAllGuests();

  // Move to the previous page
  const moveBack = useMoveBack();

  // Redirecting
  const navigate = useNavigate();

  // using the cabinId through the URL
  const { cabinId: cabinIdUrl } = useParams();

  // Getting these functions from usePopover custom hook

  const { isPopoverOpen, openPopover, closePopover, boxContainerPopoverRef } =
    usePopover();

  // Getting the width property from useWindowSize custom hook
  const { width } = useWindowSize();

  // Destructuring the following functions from useForm => React hook form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cabinId: cabinIdUrl || "",
      startDate: "",
      endDate: "",
      guestId: "",
      numGuests: 1,
      numNights: 0,
      cabinPrice: 0,
      discount: 0,
      observations: "",
      extraPrice: 0,
      totalPrice: 0,
      hasBreakfast: false,
      isPaid: false,
    },
  });

  // The default values for the create booking form
  useEffect(() => {
    reset({
      cabinId: cabinIdUrl || "",
      numGuests: 1,
      startDate: "",
      endDate: "",
      hasBreakfast: false,
      isPaid: false,
    });
  }, [cabinIdUrl, reset]);

  // watching these inputs, then check if the cabin is available at the time selected or not
  const cabinIdInput = watch("cabinId");
  const startDateInput = watch("startDate");
  const endDateInput = watch("endDate");

  // Getting these functions from useAvailability check if the cabin is available at the time selected or not
  const { availability } = useAvailability(
    cabinIdInput,
    startDateInput,
    endDateInput
  );

  // destructuring the isAvailable from availability
  const { isAvailable } = availability;

  // Getting these functions from useDatePicker to handle the date picked
  const { range, setRange, handleDayClick, handleResetRange } = useDatePicker();

  // Using these functions to check if the number of the cabin is booked or not
  const { bookedDates, isLoadingBookedDates } = useGetBookingsByCabin(
    Number(cabinIdInput)
  );

  // if loading return the spinner
  if (
    isLoadingSettings ||
    isLoadingCabins ||
    isLoadingGuests ||
    isLoadingBookedDates
  )
    return <Spinner />;

  // Calculating the number of nights
  const numNightsInput =
    startDateInput && endDateInput && endDateInput > startDateInput
      ? subtractDates(endDateInput, startDateInput)
      : 0;

  // Select a cabin
  const cabinOptions = [
    { value: "", label: "Select a Cabin" },
    ...cabins
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((cabin) => ({
        value: cabin.id,
        label: `${cabin.name}  (${cabin.maxCapacity} guests)`,
      })),
  ];

  // Option to add one guest or more
  const guestOptions = [
    { value: "", label: "Select a Guest" },
    ...guests
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
      .map((guest) => ({
        value: guest.id,
        label: guest.fullName,
      })),
  ];

  // Watching these input values
  const numGuestInput = watch("numGuests");
  const hasBreakfast = watch("hasBreakfast");
  const isPaid = watch("isPaid");

  // Catching the cabin Input
  const cabinInput = cabins.find(
    (cabinInput) => cabinInput.id === Number(cabinIdInput)
  );

  // Number of guests
  const numGuestOptions = [
    { value: "", label: "Select a number" },
    ...Array.from({ length: cabinInput?.maxCapacity }, (_, i) => ({
      value: i + 1,
      label: `${i + 1} guest${i > 0 ? "s" : ""}`,
    })),
  ];

  // The Cabin Price
  const cabinPriceInput = cabinInput
    ? cabinInput.regularPrice * numNightsInput
    : 0;

  // The Extra Price
  const extraPriceInput = hasBreakfast
    ? numNightsInput * settings.breakfastPrice * Number(numGuestInput)
    : 0;

  // Discount
  const discountInput = cabinInput ? cabinInput.discount : 0;

  // Calculating the total price
  const totalPriceInput =
    numNightsInput > 0 ? cabinPriceInput + extraPriceInput - discountInput : 0;

  // Calculating the booked dates for a cabin
  const bookedDatesForCabin = bookedDates?.flatMap(({ startDate, endDate }) => {
    const start = parseISO(startDate);
    const end = endOfDay(parseISO(endDate));

    const startToday = isBefore(start, startOfToday()) ? startOfToday() : start;

    const datesInRange = eachDayOfInterval({ start: startToday, end });
    return datesInRange;
  });

  // Cabin validation
  const bookingValidation = {
    cabinId: {
      required: "Cabin is required",
    },

    startDate: {
      required: "Check in date is required",
      validate: {
        isValidDate: (value) => isValid(parseISO(value)) || "Invalid date",
        isFutureDate: (value) =>
          isBefore(value, startOfToday())
            ? "Check in cannot before today"
            : true,
      },
    },

    endDate: {
      required: "Check out date is required",
      validate: {
        isValidDate: (value) => isValid(parseISO(value)) || "Invalid date",

        isAfterStartDate: (value) => {
          return (
            !isBefore(parseISO(value), parseISO(getValues("startDate"))) ||
            "Check out cannot be before check in"
          );
        },

        isSameDate: (value) => {
          return (
            parseISO(value).getTime() !==
              parseISO(getValues("startDate")).getTime() ||
            "Check out cannot be the same date as check in"
          );
        },
        isMinBookingLength: (value) => {
          return subtractDates(value, getValues("startDate")) >=
            settings?.minBookingLength
            ? true
            : `Minimum number of nights per booking is ${settings?.minBookingLength}`;
        },

        ismaxBookingLength: (value) => {
          return subtractDates(value, getValues("startDate")) <=
            settings?.maxBookingLength
            ? true
            : `Maximum number of nights per booking is ${settings?.maxBookingLength}`;
        },
      },
    },

    guestId: { required: "The booking must have a guest" },

    numGuests: {
      required: "Number of guests is required",
      min: {
        value: 1,
        message: "Minimum number of guests must be 1",
      },
      max: {
        value: cabinInput?.maxCapacity,
        message: `Maximum number of guests must be ${cabinInput?.maxCapacity}`,
      },
    },
  };

  function handleReset() {
    reset();
    navigate("/bookings/new");
    handleResetRange();
  }

  function onSubmit(data) {
    // selected Cabin
    const cabinIdNum = Number(data.cabinId);
    const reservedCabin = cabins.find((cabin) => cabin.id === cabinIdNum);

    const cabinPrice =
      (reservedCabin.regularPrice - reservedCabin.discount) * numNightsInput;

    const extraPrice =
      numNightsInput * settings.breakfastPrice * Number(numGuestInput);

    const totalPrice = cabinPrice + extraPrice;

    const finalData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      numNights: numNightsInput,
      numGuests: Number(data.numGuests),
      cabinId: Number(data.cabinId),
      guestId: Number(data.guestId),
      observations: data.observations,
      hasBreakfast,
      isPaid,
      cabinPrice,
      extraPrice,
      totalPrice,
      status: "unconfirmed",
    };

    createBooking(finalData, {
      onSuccess: () => {
        handleReset();
      },
    });
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <fragment>
      <div>
        <ButtonText className="button-back" onClick={moveBack}>
          &larr; Back
        </ButtonText>
      </div>

      <Row type="form">
        <Heading as="h1">
          <span>
            <HiOutlineSquare3Stack3D />
          </span>
          {cabinIdInput ? `Book Cabin ${cabinInput?.name}` : "Book Cabin"}
          <span>
            <Popover
              isOpen={isPopoverOpen}
              positions={
                width >= windowSizes.tablet
                  ? ["right", "bottom"]
                  : ["bottom", "right"]
              }
              padding={10}
              reposition={false}
              onClickOutside={closePopover}
              parentElement={boxContainerPopoverRef.current}
              content={({ position, childRect, popoverRect }) => (
                <ArrowContainer
                  position={position}
                  childRect={childRect}
                  popoverRect={popoverRect}
                  arrowColor={"var(--color-grey-400)"}
                  arrowSize={8}
                >
                  <PopoverContent>
                    &#10095; First, check if the cabin is available for the
                    selected dates. Then fill out the rest of the form to
                    complete your booking.
                  </PopoverContent>
                </ArrowContainer>
              )}
            >
              <ButtonText
                type="form"
                onClick={openPopover}
                onMouseEnter={openPopover}
                onMouseLeave={closePopover}
                whileHover={{ scale: 1.8 }}
                whileTap={
                  width >= windowSizes.tablet ? { scale: 1 } : { scale: 2 }
                }
                transition={{ duration: 0.3, type: "spring", stiffness: 500 }}
              >
                <HiOutlineQuestionMarkCircle />
              </ButtonText>
            </Popover>
          </span>
        </Heading>
      </Row>

      <MessageAvailable
        cabinIdInput={cabinIdInput}
        startDateInput={startDateInput}
        endDateInput={endDateInput}
      />

      {width >= windowSizes.tablet ? (
        <Form type="regular" onSubmit={handleSubmit(onSubmit, onError)}>
          <FormRow label="Cabin" error={errors?.cabinId?.message}>
            <Controller
              name="cabinId"
              control={control}
              rules={bookingValidation.cabinId}
              render={({ field }) => (
                <Select
                  {...field}
                  options={cabinOptions}
                  disabled={isCreating}
                />
              )}
            />
          </FormRow>

          <FormRow flex="datepicker" label="Check in - Check out dates">
            <Controller
              name="startDate"
              id="startDate"
              rules={bookingValidation.startDate}
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Controller
              name="endDate"
              id="endDate"
              rules={bookingValidation.endDate}
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />

            <DayPicker
              mode="range"
              modifiers={{ booked: bookedDatesForCabin }}
              modifiersStyles={modifiersStylesDatePicker.create}
              onDayClick={handleDayClick}
              selected={range}
              onSelect={(range) => {
                setRange(range);
                setValue(
                  "startDate",
                  range?.from ? format(range?.from, "yyyy-MM-dd") : ""
                );
                setValue(
                  "endDate",
                  range?.to ? format(range?.to, "yyyy-MM-dd") : ""
                );
              }}
              footer={<FooterDatePicker range={range} />}
            />
          </FormRow>

          <FormRow error={errors?.endDate?.message}>
            <input hidden name="endDate" id="endDate" />
          </FormRow>

          {isAvailable === false && (
            <FormRowVertical>
              {!!(cabinIdInput || startDateInput || endDateInput) && (
                <span style={{ placeSelf: "center" }}>
                  <Button
                    type="reset"
                    variation="secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </span>
              )}
            </FormRowVertical>
          )}

          {isAvailable === true && (
            <fragment>
              <FormRow label="Number of Nights">
                <Input disabled value={numNightsInput} />
              </FormRow>

              <FormRow label="Guest Name" error={errors?.guestId?.message}>
                <Controller
                  name="guestId"
                  control={control}
                  rules={bookingValidation.guestId}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={guestOptions}
                      disabled={isCreating}
                    />
                  )}
                />
              </FormRow>

              <FormRow
                label="Number of Guests"
                error={errors?.numGuests?.message}
              >
                <Controller
                  name="numGuests"
                  control={control}
                  rules={bookingValidation.numGuests}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={numGuestOptions}
                      disabled={isCreating}
                    />
                  )}
                />
              </FormRow>

              <FormRow label="Price">
                <Input disabled value={formatCurrency(cabinPriceInput)} />
              </FormRow>

              <FormRow label="Discount">
                <Input disabled value={formatCurrency(discountInput)} />
              </FormRow>

              <FormRow label="Observations">
                <Textarea
                  disabled={isCreating}
                  id="observations"
                  {...register("observations")}
                />
              </FormRow>

              <FormRow label="Extra Price">
                <Input disabled value={formatCurrency(extraPriceInput)} />
              </FormRow>

              <FormRow label="Total Price">
                <Input disabled value={formatCurrency(totalPriceInput)} />
              </FormRow>

              <FormRowVertical>
                <Controller
                  control={control}
                  name="hasBreakfast"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      id="hasBreakfast"
                      disabled={isCreating}
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    >
                      Includes breakfast?
                    </Checkbox>
                  )}
                />

                <Controller
                  control={control}
                  name="isPaid"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      id="isPaid"
                      disabled={isCreating}
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    >
                      Was paid?
                    </Checkbox>
                  )}
                />
              </FormRowVertical>

              <FormRow>
                <ButtonGroup>
                  <Button
                    variation="secondary"
                    type="reset"
                    onClick={handleReset}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isCreating}
                    type="submit"
                    variation="primary"
                  >
                    Create Booking
                  </Button>
                </ButtonGroup>
              </FormRow>
            </fragment>
          )}
        </Form>
      ) : (
        // MOBILE
        <Form type="regular" onSubmit={handleSubmit(onSubmit, onError)}>
          <FormRowVertical label="Cabin" error={errors?.cabinId?.message}>
            <Controller
              name="cabinId"
              control={control}
              rules={bookingValidation.cabinId}
              render={({ field }) => (
                <Select
                  {...field}
                  options={cabinOptions}
                  disabled={isCreating}
                />
              )}
            />
          </FormRowVertical>

          <FormRowVertical label="Check in - Check out dates">
            <Controller
              name="startDate"
              id="startDate"
              rules={bookingValidation.startDate}
              control={control}
              render={({ field }) => <input {...field} type="hidden" />}
            />
            <Controller
              name="endDate"
              id="endDate"
              rules={bookingValidation.endDate}
              control={control}
              render={({ field }) => <input {...field} type="hidden" />}
            />
            <DayPicker
              mode="single"
              modifiers={{ booked: bookedDatesForCabin }}
              modifiersStyles={modifiersStylesDatePicker.create}
              onDayClick={handleDayClick}
              selected={range}
              onSelect={(range) => {
                setRange(range);
                setValue(
                  "startDate",
                  range?.from ? format(range?.from, "yyyy-MM-dd") : ""
                );
                setValue(
                  "endDate",
                  range?.to ? format(range?.to, "yyyy-MM-dd") : ""
                );
              }}
              footer={<FooterDatePicker range={range} />}
            />
          </FormRowVertical>

          <FormRowVertical error={errors?.endDate?.message}>
            <input hidden name="endDate" id="endDate" />
          </FormRowVertical>

          {isAvailable === false && (
            <FormRowVertical>
              {!!(cabinIdInput || startDateInput || endDateInput) && (
                <span style={{ placeSelf: "center" }}>
                  <Button
                    type="reset"
                    variation="secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </span>
              )}
            </FormRowVertical>
          )}

          {isAvailable === true && (
            <fragment>
              <FormRowVertical label="Number of Nights">
                <Input disabled value={numNightsInput} />
              </FormRowVertical>

              <FormRowVertical
                label="Guest Name"
                error={errors?.guestId?.message}
              >
                <Controller
                  name="guestId"
                  control={control}
                  rules={bookingValidation.guestId}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={guestOptions}
                      disabled={isCreating}
                    />
                  )}
                />
              </FormRowVertical>

              <FormRowVertical
                label="Number of Guests"
                error={errors?.numGuests?.message}
              >
                <Controller
                  name="numGuests"
                  control={control}
                  rules={bookingValidation.numGuests}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={numGuestOptions}
                      disabled={isCreating}
                    />
                  )}
                />
              </FormRowVertical>

              <FormRowVertical label="Price">
                <Input disabled value={formatCurrency(cabinPriceInput)} />
              </FormRowVertical>

              <FormRowVertical label="Discount">
                <Input disabled value={formatCurrency(discountInput)} />
              </FormRowVertical>

              <FormRowVertical label="Observations">
                <Textarea
                  disabled={isCreating}
                  id="observations"
                  {...register("observations")}
                />
              </FormRowVertical>

              <FormRowVertical label="Extra Price">
                <Input disabled value={formatCurrency(extraPriceInput)} />
              </FormRowVertical>

              <FormRowVertical label="Total Price">
                <Input disabled value={formatCurrency(totalPriceInput)} />
              </FormRowVertical>

              <FormRowVertical>
                <Controller
                  control={control}
                  name="hasBreakfast"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      id="hasBreakfast"
                      disabled={isCreating}
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    >
                      Includes breakfast?
                    </Checkbox>
                  )}
                />

                <Controller
                  control={control}
                  name="isPaid"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      id="isPaid"
                      disabled={isCreating}
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    >
                      Was paid?
                    </Checkbox>
                  )}
                />
              </FormRowVertical>

              <FormRowVertical>
                <ButtonGroup>
                  <Button
                    variation="secondary"
                    type="reset"
                    onClick={handleReset}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isCreating}
                    type="submit"
                    variation="primary"
                  >
                    Create Booking
                  </Button>
                </ButtonGroup>
              </FormRowVertical>
            </fragment>
          )}
        </Form>
      )}
    </fragment>
  );
}

export default CreateBookingForm;
