import React, { useState } from "react";
import Container from "@/components/layout/container";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

import { useAuth } from "../../contexts/authContext";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../../firebase/firebase";

import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
} from "firebase/firestore";

import { useNavigate, Navigate } from "react-router-dom";

import { toast } from "react-toastify";
import { useEffect } from "react";

import Logo from "../../assets/logo-fitviec-black.webp";

const CustomerLogin = () => {
    const { userLoggedIn, setInSingUpInPage } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [isSigningIn, setisSigningIn] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setInSingUpInPage(true);
        return () => setInSingUpInPage(false); // Reset the state when the component is unmounted
    }, [setInSingUpInPage]);

    const checkUserRole = async (email) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            return userData.role;
        } else {
            throw new Error("No such user!");
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!isSigningIn) {
            setisSigningIn(true);
            try {
                const role = await checkUserRole(email);
                if (role === "employer") {
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password,
                    ).then(async (userCred) => {
                        const user = userCred.user;
                        console.log(user);

                        // Lấy thông tin từ Firestore
                        const userDoc = await getDoc(
                            doc(db, "users", user.uid),
                        );
                        const userData = userDoc.data();
                        const { status } = userData;
                        if (status === "approved") {
                            if (userData.state === "enable") {
                                toast.success(
                                    "Welcome to FITviec for employers ",
                                );
                            } else {
                                toast.error(
                                    "Oops ! Your account has been locked by an administrator.",
                                );
                            }
                        } else if (status === "rejected") {
                            toast.error(
                                "Oops ! Your application has been rejected by admin ! please contact us again ! ",
                            );
                        } else {
                            toast.error(
                                "Please wait An administrator verify your information & contact with you !",
                            );
                        }
                    });
                } else {
                    toast.error(
                        " Oops! This email address doesn't exist, please try again ",
                    );
                }
            } catch (error) {
                handleAuthError(error);
            } finally {
                setisSigningIn(false);
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
    const handleAuthError = (error) => {
        console.error("Sign-in error:", error);
        switch (error.code) {
            case "auth/user-not-found":
                toast.error(
                    "Oops! This email address doesn't exist, please try again",
                );
                break;
            case "auth/wrong-password":
                toast.error(
                    "Oops! This account has incorrect password, please try again",
                );
                break;
            case "auth/invalid-email":
                toast.error(
                    "Oops! This email address is invalid, please try again",
                );
                break;
            case "auth/user-disabled":
                toast.error(
                    "Oops! This user account is disabled, please try again",
                );
                break;
            case "auth/invalid-credential":
                toast.error(
                    "Oops! Invalid credentials provided, please try again",
                );
                break;
            default:
                toast.error(`Sign-in failed: ${error.message}`);
                break;
        }
    };

    return (
        <Container className="w-full max-w-full sm:px-0">
            {userLoggedIn && <Navigate to={"/"} replace={true} />}
            <div className="grid h-full w-full grid-cols-2 xl:grid-rows-1">
                {/* Left */}
                <div className="flex h-full items-center justify-center bg-linear-gradient-logo text-center ">
                    <img
                        src="https://itviec.com/assets/customer/sign_in/logo-a2f6301beddfd012e9c6a71aed3d4cae576e2c7244fb4a41b2ff7c31bbd83f0e.png"
                        alt="logo"
                        className="w-full"
                    />
                </div>
                {/* Right */}
                <div className="h-full w-full">
                    <div className="mx-auto mb-10 mt-[16vh]  max-w-[580px] ">
                        <div className="flex items-center gap-x-3">
                            <img src={Logo} className="w-24" alt="" />
                            <h3 className="text-2xl font-bold">
                                CUSTOMER ADMIN SITE
                            </h3>
                        </div>
                        <h1 className="mb-8 mt-12 text-xl font-semibold leading-6">
                            Welcome to FITviec Customer
                        </h1>
                        <div className="mb-6">
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
                        <div className="mb-6">
                            <div className="mb-1 flex justify-between">
                                <label className="mb-1 block">
                                    <span className="text-gray-900">
                                        Password{" "}
                                    </span>
                                    <abbr className="text-red-500">*</abbr>
                                </label>
                                <a
                                    href="/forgot_password"
                                    target="_blank"
                                    className="text-blue-700 hover:text-blue-900"
                                >
                                    Forgot password?
                                </a>
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
                            <div className="my-6 text-sm text-gray-600">
                                By signing in, you agree to FITviec’s{" "}
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
                            <button
                                className={`mb-6 flex h-12 w-full items-center justify-center gap-0 rounded-sm  py-2 font-bold text-white ${
                                    emailError ||
                                    passwordError ||
                                    !email ||
                                    !password ||
                                    isSigningIn
                                        ? "bg-gray-400 "
                                        : "bg-red-500 hover:bg-red-700"
                                }`}
                                onClick={handleSignIn}
                                disabled={
                                    emailError ||
                                    passwordError ||
                                    !email ||
                                    !password ||
                                    isSigningIn
                                }
                            >
                                <span>Sign In </span>
                            </button>
                            <div className="mb-10 text-center text-gray-600">
                                Don't have a customer account yet?{" "}
                                <a
                                    href="/customer/register"
                                    target="_blank"
                                    className="text-blue-700 hover:text-blue-900"
                                >
                                    Register Employer Now
                                </a>
                            </div>
                            <div className="my-4 flex items-center py-4">
                                <div className="flex-grow border-t border-solid border-gray-300"></div>
                            </div>
                            <div className="flex gap-x-1">
                                <div className="text-sm font-bold">Note:</div>
                                <div className="text-sm">
                                    Password must contain at least 12
                                    characters. Combination of symbols, numbers,
                                    uppercase letters, lowercase letters.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default CustomerLogin;
