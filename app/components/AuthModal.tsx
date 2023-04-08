"use client";

import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import { useEffect, useState, useContext } from "react";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const { error, loading, data } = useContext(AuthenticationContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const renderContent = (siginContent: string, signupConent: string) => {
    return isSignIn ? siginContent : signupConent;
  };

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const { signin, signup } = useAuth();

  const handleClick = () => {
    if (isSignIn) {
      return signin(inputs.email, inputs.password, handleClose);
    }
    return signup(inputs.firstName,inputs.lastName,inputs.city,inputs.phone,inputs.email,inputs.password, handleClose);
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (isSignIn) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
      return setDisabled(true);
    } else {
      if (
        inputs.password &&
        inputs.email &&
        inputs.firstName &&
        inputs.lastName &&
        inputs.city &&
        inputs.phone
      ) {
        return setDisabled(false);
      }
      return setDisabled(true);
    }
  }, [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <button
        className={renderContent(
          "bg-blue-400 text-white border p-1 px-4 rounded mr-3",
          "border p-1 px-4 rounded mr-3"
        )}
        onClick={handleOpen}
      >
        {renderContent("Sign in", "Sign up")}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="p-2 py-24 h-[400px] flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="p-2 h-[400px]">
               {error && <Alert severity="error">{error}</Alert>}
                <div className="uppercase font-bold text-center pb-2 border">
                  <p className="text-sm">
                    {renderContent("Sign in", "Create account")}
                  </p>
                </div>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    "Log into your account",
                    "Create your opentable account"
                  )}
                </h2>
                <AuthModalInputs
                  inputs={inputs}
                  handleChange={handleChange}
                  isSingIn={isSignIn}
                />
                <button
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent("Sign in", "Create account")}
                </button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
