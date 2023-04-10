"use client";
import { ChangeEvent, useEffect, useState } from "react";
import useReservation from "../../../../hooks/useReservation";
import { CircularProgress } from "@mui/material";

export default function Form({
  slug,
  date,
  partySize,
}: {
  slug: string;
  date: string;
  partySize: string;
}) {
  const [inputs, setInputs] = useState({
    bookerFirstName: "",
    bookerLastName: "",
    bookerPhone: "",
    bookerEmail: "",
    bookerOcassion: "",
    bookerRequest: "",
  });

  const [day, time] = date.split("T");
  const [disabled, setDisabled] = useState(true);
  const { error, loading, createReservation } = useReservation();
  const [didBook, setDidBook] = useState(false);

  useEffect(() => {
    if (
      inputs.bookerFirstName &&
      inputs.bookerLastName &&
      inputs.bookerEmail &&
      inputs.bookerPhone
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputs]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    console.log(inputs);
  };

  const handleClick = async () => {
    const booking = await createReservation({
      slug,
      partySize,
      day,
      time,
      bookerFirstName: inputs.bookerFirstName,
      bookerLastName: inputs.bookerLastName,
      bookerPhone: inputs.bookerPhone,
      bookerEmail: inputs.bookerEmail,
      bookerOcassion: inputs.bookerOcassion,
      bookerRequest: inputs.bookerRequest,
      setDidBook,
    });
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between w-[660px]">
      {didBook ? (
        <div>
          <h1>You are booked up</h1>
          <p className="">Enjoy your reservation</p>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="First name"
            onChange={(e) => handleChange(e)}
            value={inputs.bookerFirstName}
            name="bookerFirstName"
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Last name"
            onChange={(e) => handleChange(e)}
            value={inputs.bookerLastName}
            name="bookerLastName"
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Phone number"
            onChange={(e) => handleChange(e)}
            value={inputs.bookerPhone}
            name="bookerPhone"
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Email"
            onChange={(e) => handleChange(e)}
            value={inputs.bookerEmail}
            name="bookerEmail"
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Occasion (optional)"
            onChange={(e) => handleChange(e)}
            value={inputs.bookerOcassion}
            name="bookerOcassion"
          />
          <input
            type="text"
            className="border rounded p-3 w-80 mb-4"
            placeholder="Requests (optional)"
            onChange={(e) => handleChange(e)}
            value={inputs.bookerRequest}
            name="bookerRequest"
          />
          <button
            onClick={handleClick}
            disabled={disabled || loading}
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Complete reservation"
            )}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms
            of Use and Privacy Policy. Standard text message rates may apply.
            You may opt out of receiving text messages at any time.
          </p>
        </>
      )}
    </div>
  );
}
