import React, { useState, useEffect } from "react";
import Container from "@/components/layout/container";
import { Check } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

import { useAuth } from "../../contexts/authContext";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { doSignInWithGoogle } from "../../firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

import Logo from "../../assets/logo-fitviec-black.webp";

const SignUp = () => {
    const { userLoggedIn, setIsRegistered, setInSingUpInPage } = useAuth();

    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [userNameError, setUserNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [isRegistering, setIsRegistering] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [checkGoogle, setCheckGoogle] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);

    useEffect(() => {
        setInSingUpInPage(true);
        return () => setInSingUpInPage(false); // Reset the state when the component is unmounted
    }, [setInSingUpInPage]);

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!isRegistering) {
            setIsRegistering(true);
            try {
                const userCred = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                );
                const user = userCred.user;

                // Update the user's profile
                await updateProfile(user, {
                    displayName: userName,
                });

                // Store user role in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    displayName: userName,
                    email: user.email,
                    googleAuth: false,
                    state: "enable",
                    role: "user", // Default role
                });

                // Send email verification
                await sendEmailVerification(user);

                setIsRegistered(true);
                toast.success(
                    "Registration successful! Please check your email to verify your account.",
                );
                // Redirect to verify_email page after successful registration
                navigate(`/verify_email?email=${email}`);
            } catch (error) {
                handleAuthError(error);
            } finally {
                setIsRegistering(false);
            }
        }
    };

    const handleAuthError = (error) => {
        switch (error.code) {
            case "auth/email-already-in-use":
                toast.error(
                    "Oops! This email address is already in sue, please try again",
                );
                break;
            case "auth/invalid-email":
                toast.error(
                    "Oops! This email address invalid, please try again",
                );
                break;
            case "auth/operation-not-allowed":
                toast.error("Oops! Operation not allowed, please try again");
                break;
            case "auth/weak-password":
                toast.error(
                    "Oops! This password is too weak, please try again",
                );
                break;
            default:
                toast.error(`Registration failed: ${error.message}`);
                break;
        }
    };

    const validateName = (name) => {
        if (!name) {
            setUserNameError("Can't be blank");
            return false;
        } else {
            setUserNameError("");
            return true;
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

    return (
        <Container className="py-16 pt-8">
            {userLoggedIn && <Navigate to={"/"} replace={true} />}
            <div className="mb-4 flex gap-x-3">
                <h3 className="text-xl font-bold">Welcome to</h3>
                <img src={Logo} className="w-20" alt="" />
            </div>
            <div className="flex gap-x-32">
                <div className="leftside w-6/12">
                    <h3 className="mb-4 text-3xl font-bold">Sign up</h3>
                    <div className="mb-6 flex">
                        <div className="inline-flex items-center">
                            <label
                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                htmlFor="check"
                            >
                                <input
                                    type="checkbox"
                                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-red-500 checked:bg-red-500 checked:before:bg-red-500 hover:before:opacity-10"
                                    id="check"
                                    onChange={() =>
                                        setCheckGoogle(
                                            (prevState) => !prevState,
                                        )
                                    }
                                />
                                <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </label>
                        </div>
                        <div className="text-sm text-gray-600">
                            By signing up with Google, I agree to FITviec’s{" "}
                            <a
                                href="#"
                                target="_blank"
                                className="text-blue-700 hover:text-blue-900"
                            >
                                Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                target="_blank"
                                className="text-blue-700 hover:text-blue-900"
                            >
                                Privacy Policy
                            </a>{" "}
                            in relation to your privacy information.
                        </div>
                    </div>
                    <button
                        className={`flex h-12 w-full items-center justify-center gap-0 rounded-sm border  py-2 font-bold     ${
                            !checkGoogle
                                ? "border-gray-400 text-gray-400 "
                                : "border-red-500 text-red-500 hover:bg-red-50"
                        }`}
                        onClick={() => doSignInWithGoogle()}
                        disabled={!checkGoogle}
                    >
                        <img
                            src="https://itviec.com/assets/google_logo-af373a5e64715e7d4fcdea711f96995f7fd7a49725b3dd8910d4749b74742cb2.svg"
                            alt="Google Logo"
                            className="h-8 w-8"
                        />
                        <span className="pl-2">Sign Up with Google</span>
                    </button>
                    <div className="flex items-center py-4">
                        <div className="flex-grow border-t border-solid border-gray-300"></div>
                        <div className="px-2 font-medium text-gray-900">or</div>
                        <div className="flex-grow border-t border-solid border-gray-300"></div>
                    </div>
                    <div className="mb-3">
                        <label className="mb-1 block">
                            <span className="text-gray-900">Username </span>
                            <abbr className="text-red-500">*</abbr>
                        </label>
                        <input
                            className={`form-input h-12 w-full rounded-sm border ${
                                !userNameError && userName
                                    ? "border-green-500"
                                    : userNameError
                                      ? "border-red-500"
                                      : "border-gray-300"
                            } px-4 py-2`}
                            type="text"
                            placeholder="userName"
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value);
                                validateName(e.target.value);
                            }}
                            onBlur={() => {
                                if (!userName) {
                                    // Kiểm tra nếu ô input trống sau khi mất focus
                                    setUserNameError("Can't be blank");
                                }
                            }}
                            required
                        />
                        {userNameError && (
                            <span className="font-semibold text-red-500">
                                {userNameError}
                            </span>
                        )}
                    </div>
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
                    <div className="mb-6 ">
                        <div className="mb-1 flex justify-between">
                            <label className="mb-1 block">
                                <span className="text-gray-900">Password </span>
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
                                placeholder="Password"
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
                    <div className="mb-6 flex">
                        <div className="inline-flex items-center">
                            <label
                                className="relative flex cursor-pointer items-center rounded-full p-3"
                                htmlFor="check"
                            >
                                <input
                                    type="checkbox"
                                    className="before:content[''] border-blue-gray-200 before:bg-blue-gray-500 peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:opacity-0 before:transition-opacity checked:border-red-500 checked:bg-red-500 checked:before:bg-red-500 hover:before:opacity-10"
                                    id="check"
                                    onChange={() =>
                                        setCheckEmail((prevState) => !prevState)
                                    }
                                />
                                <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </span>
                            </label>
                        </div>
                        <div className="text-sm text-gray-600">
                            I have read and agree to FITviec’s{" "}
                            <a
                                href="#"
                                target="_blank"
                                className="text-blue-700 hover:text-blue-900"
                            >
                                Terms & Conditions
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                target="_blank"
                                className="text-blue-700 hover:text-blue-900"
                            >
                                Privacy Policy
                            </a>{" "}
                            in relation to your privacy information.
                        </div>
                    </div>
                    <button
                        className={`mb-6 flex h-12 w-full items-center justify-center gap-0 rounded-sm  py-2 font-bold text-white ${
                            userNameError ||
                            emailError ||
                            passwordError ||
                            !userName ||
                            !email ||
                            !password ||
                            !checkEmail ||
                            isRegistering
                                ? "bg-gray-400 "
                                : "bg-red-500 hover:bg-red-700"
                        }`}
                        onClick={handleSignIn}
                        disabled={
                            userNameError ||
                            emailError ||
                            passwordError ||
                            !userName ||
                            !email ||
                            !password ||
                            !checkEmail ||
                            isRegistering
                        }
                    >
                        <span>
                            {" "}
                            {isRegistering
                                ? "Loading..."
                                : "Sign Up with Email"}
                        </span>
                    </button>
                    <div className="mb-10 text-center text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/sign_in"
                            target="_blank"
                            className="text-blue-700 hover:text-blue-900"
                        >
                            Sign In Now!
                        </a>
                    </div>
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

export default SignUp;
