import React, { useState } from "react";
import Container from "@/components/layout/container";

import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

import { doResetPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function useQuery() {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

const ResetPassword = () => {
    const { userLoggedIn } = useAuth();
    const query = useQuery();
    const oobCode = query.get("oobCode") || "/";
    // console.log(query.get("mode"));
    // console.log(query.get("oobCode"));
    // console.log(query.get("continueUrl"));

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isUpdating, setIsUpdating] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!isUpdating) {
            setIsUpdating(true);
            try {
                await doResetPassword(oobCode, password);
                toast.success("Password has been changed, you can login now.");
                navigate("/sign_in");
            } catch (err) {
                handleAuthError(err);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError("Can't be blank");
            return false;
        } else {
            const passwordRegex =
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,}$/;
            if (!passwordRegex.test(password)) {
                setPasswordError(
                    "Password must be at least 12 characters long, include a number, an uppercase letter, a special character, no space and a lowercase letter.",
                );
                return false;
            } else {
                setPasswordError("");
                return true;
            }
        }
    };

    const validateConfirmPassword = (pw) => {
        if (!pw) {
            setConfirmPasswordError("Can't be blank");
            return false;
        } else {
            const passwordRegex =
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,}$/;
            if (!passwordRegex.test(pw)) {
                setConfirmPasswordError(
                    "Password must be at least 12 characters long, include a number, an uppercase letter, a special character, no space and a lowercase letter.",
                );
                return false;
            } else if (pw !== password) {
                setConfirmPasswordError(
                    "ConfirmPassword do not match NewPassword",
                );
                return false;
            } else {
                setConfirmPasswordError("");
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
                toast.error(`Resetting failed: ${error.message}`);
                break;
        }
    };

    return (
        <Container className="h-vh-main py-16 pt-8">
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
                    <h3 className="mb-4 text-3xl font-bold">Reset Password</h3>

                    <div className="mb-6 ">
                        <div className="mb-1 flex justify-between">
                            <label className="mb-1 block">
                                <span className="text-gray-900">
                                    New Password{" "}
                                </span>
                                <abbr className="text-red-500">*</abbr>
                            </label>
                        </div>
                        <div className="relative mb-1">
                            <span className="absolute bottom-0 right-0 translate-x-[-50%] translate-y-[-50%] transform cursor-pointer ">
                                {showPassword ? (
                                    <Eye
                                        onClick={() =>
                                            setShowPassword(
                                                (prevShowPassword) =>
                                                    !prevShowPassword,
                                            )
                                        }
                                    />
                                ) : (
                                    <EyeOff
                                        onClick={() =>
                                            setShowPassword(
                                                (prevShowPassword) =>
                                                    !prevShowPassword,
                                            )
                                        }
                                    />
                                )}
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`form-input h-12 w-full rounded-sm border ${
                                    !passwordError && password
                                        ? "border-green-500"
                                        : passwordError
                                          ? "border-red-500"
                                          : "border-gray-300"
                                } px-4 py-2`}
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                onBlur={() => {
                                    if (!password) {
                                        // Kiểm tra nếu ô input trống sau khi mất focus
                                        setPasswordError("Can't be blank");
                                    }
                                }}
                                required
                            />
                        </div>

                        {passwordError && (
                            <span className="font-semibold text-red-500">
                                {passwordError}
                            </span>
                        )}
                    </div>

                    <div className="mb-6 ">
                        <div className="mb-1 flex justify-between">
                            <label className="mb-1 block">
                                <span className="text-gray-900">
                                    Confirm Password{" "}
                                </span>
                                <abbr className="text-red-500">*</abbr>
                            </label>
                        </div>
                        <div className="relative mb-1">
                            <span className="absolute bottom-0 right-0 translate-x-[-50%] translate-y-[-50%] transform cursor-pointer ">
                                {showConfirmPassword ? (
                                    <Eye
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prevShowConfirmPassword) =>
                                                    !prevShowConfirmPassword,
                                            )
                                        }
                                    />
                                ) : (
                                    <EyeOff
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prevShowConfirmPassword) =>
                                                    !prevShowConfirmPassword,
                                            )
                                        }
                                    />
                                )}
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`form-input h-12 w-full rounded-sm border ${
                                    !confirmPasswordError && confirmPassword
                                        ? "border-green-500"
                                        : confirmPasswordError
                                          ? "border-red-500"
                                          : "border-gray-300"
                                } px-4 py-2`}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    validateConfirmPassword(e.target.value);
                                }}
                                onBlur={() => {
                                    if (!confirmPassword) {
                                        // Kiểm tra nếu ô input trống sau khi mất focus
                                        setConfirmPasswordError(
                                            "Can't be blank",
                                        );
                                    }
                                }}
                                required
                            />
                        </div>

                        {confirmPasswordError && (
                            <span className="font-semibold text-red-500">
                                {confirmPasswordError}
                            </span>
                        )}
                    </div>

                    <button
                        className={`mb-10 mt-6 flex h-12 w-full items-center justify-center gap-0 rounded-sm  py-2 font-bold text-white ${
                            confirmPasswordError ||
                            !confirmPassword ||
                            passwordError ||
                            !password ||
                            isUpdating
                                ? "bg-gray-400 "
                                : "bg-red-500 hover:bg-red-700"
                        }`}
                        onClick={handleSignIn}
                        disabled={
                            confirmPasswordError || passwordError || isUpdating
                        }
                    >
                        <span>
                            {" "}
                            {isUpdating ? "Updating..." : "Update New Password"}
                        </span>
                    </button>
                    <div className="flex gap-x-1">
                        <div className="text-sm font-bold">Note:</div>
                        <div className="text-sm">
                            Password must contain at least 12 characters.
                            Combination of symbols, numbers, uppercase letters,
                            lowercase letters.
                        </div>
                    </div>
                </div>
                <div className="rightside flex w-6/12 items-center justify-center">
                    <img
                        src="https://itviec.com/assets/robby-login-df4a56395486b5cea97ba1754d226059626e6e124b3ea3db0789ba3c39f644f1.png"
                        alt=""
                        className="max-h-full max-w-full"
                    />
                </div>
            </div>
        </Container>
    );
};

export default ResetPassword;
