import React, { useState } from "react";
import Container from "@/components/layout/container";
import {
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    PhoneCall,
    Mail,
    Lock,
    User,
    Phone,
    Building,
    MapPin,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useAuth } from "../../contexts/authContext";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

import { auth, db } from "../../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import Logo from "../../assets/logo-fitviec-black.webp";

// Get the current date and format it
const currentDate = new Date();
const day = String(currentDate.getDate()).padStart(2, "0");
const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
const year = currentDate.getFullYear();
const registrationDate = `${day}/${month}/${year}`;

const CustomerRegister = () => {
    const { userLoggedIn, setIsRegistered, setInSingUpInPage } = useAuth();

    const navigate = useNavigate();

    // state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPolicy, setShowPolicy] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [workLocation, setWorkLocation] = useState("");
    const [checkEmail, setCheckEmail] = useState(false);
    const [gender, setGender] = useState("");
    // error
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [fullNameError, setFullNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [companyNameError, setCompanyNameError] = useState(false);
    const [workLocationError, setWorkLocationError] = useState(false);

    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        setInSingUpInPage(true);
        return () => setInSingUpInPage(false); // Reset the state when the component is unmounted
    }, [setInSingUpInPage]);

    const handleRegister = async (e) => {
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
                    displayName: fullName,
                    phoneNumber: phone,
                });

                // Store user role in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    displayName: fullName,
                    email: user.email,
                    gender: gender,
                    phone: phone,
                    company: companyName,
                    workLocation: workLocation,
                    registrationDate: registrationDate,
                    googleAuth: false,
                    state: "enable",
                    status: "pending",
                    role: "employer", // role employer
                });
              setIsRegistered(true);
              registerEmployer(user.accessToken)
                toast.success(
                    "Registration successful! You'll receive a mail if approved by the administrator",
                );
                navigate(`/customer/notification`);
            } catch (error) {
                handleAuthError(error);
            } finally {
                setIsRegistering(false);
            }
        }
  };
  
  const registerEmployer = async (token) => {
    try {
      const response = await fetch(
        "https://employer-service-otwul2bnna-uc.a.run.app/employer/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({
            "companyName": companyName,
            "location": workLocation,
          }), 
        }
      )
      if (response.status === 200) {
        console.log("Register successfully")
      } else {
        console.log("Failed");
      }
    } catch (error) {
      console.log("Error registering employer: ", error);
    }
  }

    // validate

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

    const validateEmail = (email) => {
        if (!email) {
            setEmailError("Please enter your email");
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
            setPasswordError("Please enter your password");
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
            setConfirmPasswordError("Please enter confirm your password");
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

    const validateName = (name) => {
        if (!name) {
            setFullNameError("Please enter your full name");
            return false;
        } else {
            setFullNameError("");
            return true;
        }
    };

    const validatePhone = (phone) => {
        if (!phone) {
            setPhoneError("Please enter your phone");
            return false;
        } else if (phone.length < 10 || phone.length > 11) {
            setPhoneError("Phone number must be between 10 and 11 characters");
            return false;
        } else {
            setPhoneError(""); // Assuming you meant setPhoneError here
            return true;
        }
    };

    const validateCompanyName = (name) => {
        if (!name) {
            setCompanyNameError("Please enter your company name");
            return false;
        } else {
            setCompanyNameError("");
            return true;
        }
    };

    const validateLocation = (location) => {
        if (!location) {
            setWorkLocationError("Please enter your work location");
            return false;
        } else {
            setWorkLocationError("");
            return true;
        }
    };

    return (
        <Container className="w-full max-w-full">
            {userLoggedIn && <Navigate to={"/"} replace={true} />}
            <div className="grid h-full w-full grid-cols-3 xl:grid-rows-1">
                {/* Left */}
                <div className="bg-content col-span-2 h-full w-full bg-itviec-register-employer bg-bottom bg-no-repeat pb-8">
                    {/* Header */}
                    <div className="mx-auto mb-8 mt-[6vh] max-w-[1000px] ">
                        <div className="flex items-center gap-x-3">
                            <img src={Logo} className="w-24" alt="" />
                            <h3 className="text-3xl font-bold">
                                CUSTOMER ADMIN SITE
                            </h3>
                        </div>
                        <h1 className="mb-4 mt-6 text-2xl font-semibold leading-6">
                            Sign Up For Customer Account
                        </h1>
                        <span className="text-sm  text-gray-600 ">
                            Let's create advantages for businesses by
                            experiencing deep application recruitment technology
                            AI & Hiring Funnel.
                        </span>
                    </div>
                    {/* Regulations */}
                    <div className="mx-auto mb-8 max-w-[1000px] rounded-lg border-2 border-blue-700 p-4">
                        <div
                            className="flex cursor-pointer items-center justify-between"
                            onClick={() =>
                                setShowPolicy((prevShow) => !prevShow)
                            }
                        >
                            <span className="text-lg font-semibold">
                                Regulations
                            </span>
                            <span>
                                {showPolicy ? <ChevronUp /> : <ChevronDown />}
                            </span>
                        </div>
                        {/* policy */}
                        <div
                            className={`transition-max-height overflow-hidden duration-300 ease-in-out ${
                                showPolicy ? "max-h-[500px]" : "max-h-0"
                            }`}
                        >
                            <div className="text-sm text-gray-600">
                                <div className="py-4">
                                    <span>
                                        To ensure service quality,
                                        <strong> FITviec </strong>
                                    </span>
                                    <span className="font-semibold text-red-500">
                                        does not allow a user to create many
                                        different accounts
                                    </span>
                                    <span> .</span>
                                </div>
                                <div className="py-4">
                                    <span>
                                        If a violation is detected,{" "}
                                        <strong>FITviec</strong> will stop
                                        providing services to all duplicate
                                        accounts or block all access to{" "}
                                        <strong>FITviec's </strong> website
                                        system. In case customers have used up
                                        all 3 free job postings,{" "}
                                        <strong>FITviec </strong>
                                        supports activating unlimited job
                                        postings after the business provides
                                        business license information.
                                    </span>
                                </div>
                                <div className="py-4">
                                    <span>
                                        If you have any questions, please
                                        contact Customer Service Hotline :
                                    </span>
                                </div>
                                <div className="text-xl font-semibold text-blue-700">
                                    <PhoneCall className="mr-4 inline h-8 w-8 rounded-full border-2 border-blue-700 bg-white p-[5px] text-blue-700" />
                                    (+84) 123 345 567
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Account */}
                    <div className="mx-auto mb-8 max-w-[1000px] ">
                        {/* Account Information */}
                        <div>
                            <h1 className="mb-3 mt-6 text-2xl font-bold ">
                                Account
                            </h1>
                            {/* Email */}
                            <div className="mb-5 ">
                                <div className="mb-1 flex justify-between">
                                    <label className="mb-1 block">
                                        <span className="font-semibold text-gray-900">
                                            Email login{" "}
                                        </span>
                                        <abbr className="text-red-500">*</abbr>
                                    </label>
                                </div>
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 left-0 translate-x-[60%] translate-y-[-50%] transform cursor-pointer ">
                                        <Mail className=" text-blue-700" />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-input h-12 w-full rounded-sm border ${
                                            !emailError && email
                                                ? "border-green-500"
                                                : emailError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        } py-2 pl-12 pr-4`}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            validateEmail(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!email) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setEmailError(
                                                    "Please enter your email",
                                                );
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                {emailError && (
                                    <span className="font-semibold text-red-500">
                                        {emailError}
                                    </span>
                                )}
                                <span className="block text-sm font-light text-red-500">
                                    In case you register an account with an
                                    email other than your company domain email,
                                    some services on the account may have
                                    limited purchasing or use rights.
                                </span>
                            </div>
                            {/* Password */}
                            <div className="mb-5 ">
                                <div className="mb-1 flex justify-between">
                                    <label className="mb-1 block">
                                        <span className="font-semibold text-gray-900">
                                            Password{" "}
                                        </span>
                                        <abbr className="text-red-500">*</abbr>
                                    </label>
                                </div>
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 left-0 translate-x-[60%] translate-y-[-50%] transform cursor-pointer ">
                                        <Lock className=" text-blue-700" />
                                    </span>
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
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className={`form-input h-12 w-full rounded-sm border ${
                                            !passwordError && password
                                                ? "border-green-500"
                                                : passwordError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        }py-2 pl-12 pr-4`}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            validatePassword(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!password) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setPasswordError(
                                                    "Please enter your password",
                                                );
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
                            {/* ConfirmPassword */}
                            <div className="mb-6 ">
                                <div className="mb-1 flex justify-between">
                                    <label className="mb-1 block">
                                        <span className="font-semibold text-gray-900">
                                            Confirm the password{" "}
                                        </span>
                                        <abbr className="text-red-500">*</abbr>
                                    </label>
                                </div>
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 left-0 translate-x-[60%] translate-y-[-50%] transform cursor-pointer ">
                                        <Lock className=" text-blue-700" />
                                    </span>
                                    <span className="absolute bottom-0 right-0 translate-x-[-50%] translate-y-[-50%] transform cursor-pointer ">
                                        {showConfirmPassword ? (
                                            <Eye
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (
                                                            prevShowConfirmPassword,
                                                        ) =>
                                                            !prevShowConfirmPassword,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <EyeOff
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (
                                                            prevShowConfirmPassword,
                                                        ) =>
                                                            !prevShowConfirmPassword,
                                                    )
                                                }
                                            />
                                        )}
                                    </span>
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`form-input h-12 w-full rounded-sm border ${
                                            !confirmPasswordError &&
                                            confirmPassword
                                                ? "border-green-500"
                                                : confirmPasswordError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        }py-2 pl-12 pr-4`}
                                        placeholder="Password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            validateConfirmPassword(
                                                e.target.value,
                                            );
                                        }}
                                        onBlur={() => {
                                            if (!confirmPassword) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setConfirmPasswordError(
                                                    "Please enter confirm your password",
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
                        </div>
                        {/* Employer information */}
                        <div>
                            <h1 className="mb-3 mt-6 text-2xl font-bold ">
                                Employer information
                            </h1>
                            {/* Name & Gender */}
                            <div className="mb-5 flex">
                                <div className=" w-1/2">
                                    <div className="mb-1 flex justify-between">
                                        <label className="mb-1 block">
                                            <span className="font-semibold text-gray-900">
                                                First and last name{" "}
                                            </span>
                                            <abbr className="text-red-500">
                                                *
                                            </abbr>
                                        </label>
                                    </div>
                                    <div className="relative mb-1">
                                        <span className="absolute bottom-0 left-0 translate-x-[60%] translate-y-[-50%] transform cursor-pointer ">
                                            <User className=" text-blue-700" />
                                        </span>
                                        <input
                                            type="text"
                                            className={`form-input h-12 w-full rounded-sm border ${
                                                !fullNameError && fullName
                                                    ? "border-green-500"
                                                    : fullNameError
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                            } py-2 pl-12 pr-4`}
                                            placeholder="First and last name"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                validateName(e.target.value);
                                            }}
                                            onBlur={() => {
                                                if (!fullName) {
                                                    // Kiểm tra nếu ô input trống sau khi mất focus
                                                    setFullNameError(
                                                        "Please enter your full name",
                                                    );
                                                }
                                            }}
                                            required
                                        />
                                    </div>
                                    {fullNameError && (
                                        <span className="font-semibold text-red-500">
                                            {fullNameError}
                                        </span>
                                    )}
                                </div>
                                <div className="w-1/4"></div>
                                <div className="w-1/4">
                                    <div className="mb-1 flex justify-between">
                                        <label className="mb-1 block">
                                            <span className="font-semibold text-gray-900">
                                                Gender:{" "}
                                            </span>
                                            <abbr className="text-red-500">
                                                *
                                            </abbr>
                                        </label>
                                    </div>
                                    <RadioGroup
                                        value={gender}
                                        onValueChange={(value) => {
                                            setGender(value);
                                        }}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="male"
                                                id="male"
                                                className="border-gray-700 text-blue-700"
                                            />
                                            <Label htmlFor="male">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="female"
                                                id="female"
                                                className="border-gray-700 text-blue-700"
                                            />
                                            <Label htmlFor="female">
                                                Female
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            {/* Personal phone number */}
                            <div className="mb-5 ">
                                <div className="mb-1 flex justify-between">
                                    <label className="mb-1 block">
                                        <span className="font-semibold text-gray-900">
                                            Personal phone number{" "}
                                        </span>
                                        <abbr className="text-red-500">*</abbr>
                                    </label>
                                </div>
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 left-0 translate-x-[60%] translate-y-[-50%] transform cursor-pointer ">
                                        <Phone className=" text-blue-700" />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-input h-12 w-full rounded-sm border ${
                                            !phoneError && phone
                                                ? "border-green-500"
                                                : phoneError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        } py-2 pl-12 pr-4`}
                                        maxLength="11"
                                        placeholder="Personal phone number"
                                        value={phone}
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                            validatePhone(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!phone) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setPhoneError(
                                                    "Please enter your phone",
                                                );
                                            }
                                        }}
                                        onKeyPress={(e) => {
                                            const charCode = e.charCode;
                                            if (
                                                charCode < 48 ||
                                                charCode > 57
                                            ) {
                                                e.preventDefault();
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                {phoneError && (
                                    <span className="font-semibold text-red-500">
                                        {phoneError}
                                    </span>
                                )}
                            </div>
                            {/* Company */}
                            <div className="mb-5 ">
                                <div className="mb-1 flex justify-between">
                                    <label className="mb-1 block">
                                        <span className="font-semibold text-gray-900">
                                            Company{" "}
                                        </span>
                                        <abbr className="text-red-500">*</abbr>
                                    </label>
                                </div>
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 left-0 translate-x-[60%] translate-y-[-50%] transform cursor-pointer ">
                                        <Building className=" text-blue-700" />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-input h-12 w-full rounded-sm border ${
                                            !companyNameError && companyName
                                                ? "border-green-500"
                                                : companyNameError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        } py-2 pl-12 pr-4`}
                                        placeholder="Company name"
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            validateCompanyName(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!companyName) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setCompanyNameError(
                                                    "Please enter your company name",
                                                );
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                {companyNameError && (
                                    <span className="font-semibold text-red-500">
                                        {companyNameError}
                                    </span>
                                )}
                            </div>
                            {/* Work location */}
                            <div className="mb-6 ">
                                <div className="mb-1 flex justify-between">
                                    <label className="mb-1 block">
                                        <span className="font-semibold text-gray-900">
                                            Work location{" "}
                                        </span>
                                        <abbr className="text-red-500">*</abbr>
                                    </label>
                                </div>
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 left-0 translate-x-[60%] translate-y-[-50%] transform cursor-pointer ">
                                        <MapPin className=" text-blue-700" />
                                    </span>
                                    <input
                                        type="text"
                                        className={`form-input h-12 w-full rounded-sm border ${
                                            !workLocationError && workLocation
                                                ? "border-green-500"
                                                : workLocationError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        } py-2 pl-12 pr-4`}
                                        placeholder="Work location (province, city, district, ward, street...)"
                                        value={workLocation}
                                        onChange={(e) => {
                                            setWorkLocation(e.target.value);
                                            validateLocation(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!workLocation) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setWorkLocationError(
                                                    "Please enter your work location",
                                                );
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                {workLocationError && (
                                    <span className="font-semibold text-red-500">
                                        {workLocationError}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Policy & button */}
                    <div className="mx-auto mb-8 max-w-[1000px] ">
                        <div className="mb-6 flex items-center ">
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
                                            setCheckEmail(
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
                                emailError ||
                                passwordError ||
                                !email ||
                                !password ||
                                !confirmPassword ||
                                !fullName ||
                                !phone ||
                                !companyName ||
                                !workLocation ||
                                !gender ||
                                confirmPasswordError ||
                                fullNameError ||
                                phoneError ||
                                companyNameError ||
                                workLocationError ||
                                !checkEmail ||
                                isRegistering
                                    ? "bg-gray-400 "
                                    : "bg-red-500 hover:bg-red-700"
                            }`}
                            disabled={
                                emailError ||
                                passwordError ||
                                !email ||
                                !password ||
                                !confirmPassword ||
                                !fullName ||
                                !phone ||
                                !companyName ||
                                !workLocation ||
                                !gender ||
                                confirmPasswordError ||
                                fullNameError ||
                                phoneError ||
                                companyNameError ||
                                workLocationError ||
                                !checkEmail ||
                                isRegistering
                            }
                            onClick={handleRegister}
                        >
                            <span>
                                {" "}
                                {isRegistering
                                    ? "Loading..."
                                    : "Register Employer"}
                            </span>
                        </button>
                    </div>
                </div>
                {/* Right */}
                <div className="flex h-full items-center justify-center bg-linear-gradient-logo text-center ">
                    <img
                        src="https://itviec.com/assets/customer/sign_in/logo-a2f6301beddfd012e9c6a71aed3d4cae576e2c7244fb4a41b2ff7c31bbd83f0e.png"
                        alt="logo"
                        className="w-full"
                    />
                </div>
            </div>
        </Container>
    );
};

export default CustomerRegister;
