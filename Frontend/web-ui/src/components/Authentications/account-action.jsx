import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doApplyActionCode } from "@/firebase/auth";
import Container from "@/components/layout/container";
import ResetPassword from "./reset-password";

const AccountAction = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);

    const mode = query.get("mode");
    const oobCode = query.get("oobCode");

    const [verificationInProgress, setVerificationInProgress] = useState(false);

    useEffect(() => {
        if (
            !mode ||
            !oobCode ||
            (mode !== "resetPassword" && mode !== "verifyEmail")
        ) {
            // Nếu mode hoặc oobCode không tồn tại, hoặc mode không hợp lệ, thì redirect về trang chính
            navigate("/");
        }
    }, [mode, oobCode, navigate]);

    useEffect(() => {
        const handleEmailVerification = async () => {
            setVerificationInProgress(true);
            try {
                await doApplyActionCode(oobCode);
                toast.success(
                    "Verified your account successfully. Welcome to FITViec!",
                );
                navigate("/sign_in");
            } catch (error) {
                handleAuthError(error);
            } finally {
                setVerificationInProgress(false);
            }
        };

        if (mode === "verifyEmail") {
            handleEmailVerification();
        }
    }, [mode, oobCode, navigate]);

    const handleAuthError = (error) => {
        switch (error.code) {
            case "auth/user-not-found":
                toast.error(
                    "No user found for this action code. The user may have been deleted.",
                );
                break;
            case "auth/user-disabled":
                toast.error(
                    "The user corresponding to this action code has been disabled.",
                );
                break;

            case "auth/expired-action-code":
                toast.error(
                    "Oops! This action code has expired, please request a new one.",
                );
                break;
            case "auth/invalid-action-code":
                toast.error(
                    "Oops! This action code is invalid, please request a new one.",
                );
                break;
            default:
                toast.error(`An error occurred: ${error.message}`);
                break;
        }
    };

    return (
        <Container className="h-vh-main py-16 pt-8">
            {mode === "resetPassword" && <ResetPassword />}
            {mode === "verifyEmail" && (
                <div className="flex flex-col items-center justify-center">
                    <h3 className="mb-8 mt-6 text-2xl font-bold text-gray-700">
                        Verifying Your Email
                    </h3>
                    {verificationInProgress && (
                        <div className="flex flex-col items-center">
                            <svg
                                className="mb-4 h-8 w-8 animate-spin text-gray-700"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                            <p className="text-lg text-gray-600">
                                Please wait while we verify your email...
                            </p>
                        </div>
                    )}
                    <img
                        src="  https://itviec.com/blog/wp-content/uploads/2015/03/rob.png"
                        className="w-60"
                        alt=""
                    />
                </div>
            )}
        </Container>
    );
};

export default AccountAction;
