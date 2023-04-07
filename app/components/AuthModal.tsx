"use client";

import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import { useState } from "react";
import AuthModalInputs from "./AuthModalInputs";

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
          <div className="p-2 h-[400px]">
            <div className="uppercase font-bold text-center pb-2 border">
              <p className="text-sm">
                {renderContent("Sign in", "Create account")}
                {inputs.email}
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
            <button className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400">
              {renderContent("Sign in", "Create account")}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
