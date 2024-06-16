import React, { useState } from "react";
import Container from "@/components/layout/container";

import { doSendEmailPasswordReset } from "@/firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const { userLoggedIn } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);

    const [isReseting, setIsReseting] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!isReseting) {
            setIsReseting(true);
            try {
                const result = await doSendEmailPasswordReset(email);
                toast.success(
                    "You will receive an email with instructions about how to reset your password in a few minutes.",
                );
            } catch (err) {
                handleAuthError(err);
            } finally {
                setIsReseting(false);
            }
        }
    };

    const validateEmail = (email) => {
        if (!email) {
            setEmailError("Can't be blank");
            return false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailError("Please check your email");
                return false;
            } else {
                setEmailError("");
                return true;
            }
        }
    };

    const handleAuthError = (error) => {
        switch (error.code) {
            case "auth/user-not-found":
                toast.error(
                    "Oops! This email address doesn't exist, please try again",
                );
                break;
            case "auth/invalid-email":
                toast.error(
                    "Oops! This email address invalid, please try again",
                );
                break;
            case "auth/user-disabled":
                toast.error(
                    "Oops! This user account is disabled, please try again ",
                );
                break;
            case "auth/invalid-credential":
                toast.error(
                    "Oops! Invalid credentials provided., please try again ",
                );
                break;
            default:
                toast.error(`Send Email Reset failed: ${error.message}`);
                break;
        }
    };

    return (
        <Container className=" py-24 ">
            {userLoggedIn && <Navigate to={"/"} replace={true} />}
            <div className="mb-4 flex gap-x-3">
                <h3 className="text-xl font-bold">Welcome to</h3>
                <img
                    src="https://itviec.com/assets/logo_black_text-04776232a37ae9091cddb3df1973277252b12ad19a16715f4486e603ade3b6a4.png"
                    className="w-20"
                    alt=""
                />
            </div>
            <div className="flex gap-x-32">
                <div className="leftside w-6/12">
                    <h3 className="mb-4 text-3xl font-bold">
                        Forgot password ?
                    </h3>

                    <div className="mb-3">
                        <label className="mb-1 block">
                            <span className="text-gray-900">Email </span>
                            <abbr className="text-red-500">*</abbr>
                        </label>
                        <input
                            className={`form-input h-12 w-full rounded-sm border ${
                                !emailError && email
                                    ? "border-green-500"
                                    : emailError
                                      ? "border-red-500"
                                      : "border-gray-300"
                            } px-4 py-2`}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateEmail(e.target.value);
                            }}
                            onBlur={() => {
                                if (!email) {
                                    // Kiểm tra nếu ô input trống sau khi mất focus
                                    setEmailError("Can't be blank");
                                }
                            }}
                            required
                        />
                        {emailError && (
                            <span className="font-semibold text-red-500">
                                {emailError}
                            </span>
                        )}
                    </div>

                    <button
                        className={`mt-6 flex h-12 w-full items-center justify-center gap-0 rounded-sm  py-2 font-bold text-white ${
                            emailError || !email || isReseting
                                ? "bg-gray-400 "
                                : "bg-red-500 hover:bg-red-700"
                        }`}
                        onClick={handleSignIn}
                        disabled={emailError || isReseting || !email}
                    >
                        <span>
                            {" "}
                            {isReseting ? "Loading..." : "Reset Password"}
                        </span>
                    </button>
                    <div className="flex items-center py-4">
                        <div className="flex-grow border-t border-solid border-gray-300"></div>
                        <div className="px-2 font-medium text-gray-900">or</div>
                        <div className="flex-grow border-t border-solid border-gray-300"></div>
                    </div>
                    <button
                        className={`mb-6 flex h-12 w-full items-center justify-center gap-0 rounded-sm  border-2 border-red-500 bg-white py-2 font-semibold text-red-500 hover:bg-red-100
                        `}
                        onClick={() => {
                            navigate("/sign_in");
                        }}
                    >
                        <span>Sign In</span>
                    </button>
                </div>
                <div className="rightside flex w-6/12 items-center justify-center">
                    <img
                        src="https://itviec.com/assets/robby-sad-a1fb55a6e3945a12eff5fb75d5bbf4e34784cea4ae905ac0a90a7c2b76507983.png"
                        alt=""
                        className="max-h-full max-w-full"
                    />
                </div>
            </div>
        </Container>
    );
};

export default ForgotPassword;
