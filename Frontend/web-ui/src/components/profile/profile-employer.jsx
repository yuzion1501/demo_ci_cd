import Container from "@/components/layout/container";
import { useState, useEffect } from "react";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";
import {
    Mail,
    Gift,
    MapPin,
    Phone,
    User,
    Globe,
    SquarePen,
} from "lucide-react";
import {
    getAuth,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    deleteUser,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";
import PersonalInfoPopUp from "./PopupForm/personal-info-popup";

const defaultAvt =
    "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png";

const capitalized = (letter) => {
    return letter.charAt(0).toUpperCase() + letter.slice(1);
};

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
};

const SettingsAccount = () => {
    const { currentUser, setCurrentUser, isGoogleUser } = useAuth();
    const auth = getAuth();

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showDeleteUser, setShowDeleteUser] = useState(false);

    const [deletePassword, setDeletePassword] = useState("");
    const [deletePasswordError, setDeletePasswordError] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    const [isOpenPopupPersonal, setIsPopupPersonal] = useState(false);

    // Updating Password
    const [isUpdating, setIsUpdating] = useState(false);
    // Delete User
    const [isDeleting, setIsDeleting] = useState(false);

    const handleModifyPersonalClick = () => {
        setIsPopupPersonal(true);
    };

    const validatePassword = (password) => {
        if (!password) {
            setPasswordError("Please enter your current password");
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

    const validateNewPassword = (password) => {
        if (!password) {
            setNewPasswordError("Please enter your new password");
            return false;
        } else {
            const passwordRegex =
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,}$/;
            if (!passwordRegex.test(password)) {
                setNewPasswordError(
                    "Password must be at least 12 characters long, include a number, an uppercase letter, a special character, no space and a lowercase letter.",
                );
                return false;
            } else {
                setNewPasswordError("");
                return true;
            }
        }
    };

    const validateConfirmPassword = (pw) => {
        if (!pw) {
            setConfirmPasswordError("Please confirm your new password");
            return false;
        } else {
            const passwordRegex =
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,}$/;
            if (!passwordRegex.test(pw)) {
                setConfirmPasswordError(
                    "Password must be at least 12 characters long, include a number, an uppercase letter, a special character, no space and a lowercase letter.",
                );
                return false;
            } else if (pw !== newPassword) {
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

    const validateDeletePassword = (password) => {
        if (!password) {
            setDeletePasswordError("Please enter your current password");
            return false;
        } else {
            const passwordRegex =
                /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{12,}$/;
            if (!passwordRegex.test(password)) {
                setDeletePasswordError(
                    "Password must be at least 12 characters long, include a number, an uppercase letter, a special character, no space and a lowercase letter.",
                );
                return false;
            } else {
                setDeletePasswordError("");
                return true;
            }
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password,
            );

            await reauthenticateWithCredential(auth.currentUser, credential);

            await updatePassword(auth.currentUser, newPassword);

            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success(" Saved new password successfully! ");
        } catch (error) {
            console.error(error);

            if (error.code && error.code.startsWith("auth/")) {
                switch (error.code) {
                    case "auth/wrong-password":
                        toast.error(
                            "The current password is incorrect. Please try again.",
                        );
                        break;
                    case "auth/weak-password":
                        toast.error(
                            "The new password is too weak. Please choose a stronger password.",
                        );
                        break;
                    case "auth/requires-recent-login":
                        toast.error(
                            "Your session has expired. Please log in again and try to update your password.",
                        );
                        break;
                    case "auth/user-not-found":
                        toast.error(
                            "User not found. Please check your user data and try again.",
                        );
                        break;
                    default:
                        toast.error(
                            `Failed to update password: ${error.message}`,
                        );
                        break;
                }
            } else {
                toast.error(`Something went wrong: ${error.message}`);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    // user email
    const handleDeleteUser = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        try {
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                deletePassword,
            );

            // Xác thực lại người dùng với mật khẩu hiện tại
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Xóa tài khoản người dùng
            await deleteUser(auth.currentUser);
            toast.success("Account deleted successfully!");
            navigate("/");
        } catch (error) {
            console.error(error);

            if (error.code && error.code.startsWith("auth/")) {
                switch (error.code) {
                    case "auth/wrong-password":
                        toast.error(
                            "The current password is incorrect. Please try again.",
                        );
                        break;
                    case "auth/requires-recent-login":
                        toast.error(
                            "Your session has expired. Please log in again and try to delete your account.",
                        );
                        break;
                    case "auth/user-not-found":
                        toast.error(
                            "User not found. Please check your user data and try again.",
                        );
                        break;
                    default:
                        toast.error(
                            `Failed to delete account: ${error.message}`,
                        );
                        break;
                }
            } else {
                toast.error(`Something went wrong: ${error.message}`);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Profile */}
            <Container className="max-w-[1000px] pb-4 pt-10">
                <div className="grid  w-full grid-cols-6 rounded-lg bg-white  shadow-lg">
                    <div className="col-span-1">
                        <div className="mt-3 p-4">
                            <img
                                src={
                                    currentUser.photoURL
                                        ? currentUser?.photoURL
                                        : defaultAvt
                                }
                                alt="Avatar"
                                className="h-32 w-32 rounded-full object-cover  opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                    <div className="relative col-span-5">
                        <div className="h-2/5">
                            <div className="flex flex-row justify-between">
                                <div className="ml-3 mt-3 p-3">
                                    <p className="text-2xl font-bold text-slate-700">
                                        {capitalized(currentUser?.displayName)}
                                    </p>
                                    <p
                                        className={`mt-2 text-lg font-bold text-gray-400 ${currentUser.title ? "font-bold text-slate-700" : ""}`}
                                    >
                                        {currentUser.title
                                            ? currentUser.title
                                            : "Your title"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="col-span-1 ml-3  p-3">
                                <div className="mb-3 flex items-center gap-2 text-gray-400">
                                    <Mail className="h-5 w-5" />{" "}
                                    <span
                                        className={`${currentUser.email ? "text-slate-800" : ""}`}
                                    >
                                        {currentUser.email
                                            ? currentUser.email
                                            : "Your email"}
                                    </span>
                                </div>
                                <div className="mb-3 flex items-center gap-2 text-gray-400">
                                    <Gift className="h-5 w-5" />{" "}
                                    <span
                                        className={`${currentUser.birthday ? "text-slate-800" : ""}`}
                                    >
                                        {currentUser.birthday
                                            ? formatDate(currentUser.birthday)
                                            : "Your date of birth"}
                                    </span>
                                </div>
                                <div className="mb-3 flex items-center gap-2 text-gray-400">
                                    <MapPin className="h-5 w-5" />{" "}
                                    <span
                                        className={`${currentUser.address ? "text-slate-800" : ""}`}
                                    >
                                        {currentUser.address
                                            ? currentUser.address
                                            : "Your current address"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-1  p-3">
                                <div className="mb-3 flex items-center gap-2 text-gray-400">
                                    <Phone className="h-5 w-5" />{" "}
                                    <span
                                        className={`${currentUser.phone ? "text-slate-800" : ""}`}
                                    >
                                        {currentUser.phone
                                            ? currentUser.phone
                                            : "Your phone number"}
                                    </span>
                                </div>
                                <div className="mb-3 flex items-center gap-2 text-gray-400">
                                    <User className="h-5 w-5" />{" "}
                                    <span
                                        className={`${currentUser.gender ? "text-slate-800" : ""}`}
                                    >
                                        {currentUser.gender
                                            ? capitalized(currentUser.gender)
                                            : "Your gender"}
                                    </span>
                                </div>
                                <div className="mb-3 flex items-center gap-2 text-gray-400">
                                    <Globe className="h-5 w-5" />{" "}
                                    <span
                                        className={`${currentUser.personalLink ? "text-slate-800" : ""}`}
                                    >
                                        {currentUser.personalLink
                                            ? currentUser.personalLink
                                            : "Your personal link"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* edit button */}
                        <button onClick={handleModifyPersonalClick}>
                            <SquarePen className="absolute right-0 top-0 h-5 w-5 translate-x-[-150%] translate-y-6 cursor-pointer text-red-500" />
                        </button>
                    </div>
                </div>
            </Container>
            {isOpenPopupPersonal && (
                <PersonalInfoPopUp
                    userInfo={currentUser}
                    onClose={() => setIsPopupPersonal(false)}
                />
            )}
            {/* UpdatePassword */}
            <Container className="max-w-[1000px] pb-4 pt-4">
                <div className="mt-4 flex w-full flex-col rounded-lg bg-white shadow-lg">
                    <div className="mx-8 grid grid-cols-12   pb-4 pt-6 ">
                        <div className="col-span-3">
                            <p className="text-xl font-bold text-slate-700">
                                Change Password
                            </p>
                        </div>
                        <div className="col-span-9 flex flex-col justify-center">
                            {/* Current Password */}
                            <div className="mb-2 ">
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
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className={`form-input h-12 w-full rounded-sm border text-slate-700 ${
                                            !passwordError && password
                                                ? "border-green-500"
                                                : passwordError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        } px-4 py-2`}
                                        placeholder="Current password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            validatePassword(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!password) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setPasswordError(
                                                    "Please enter your current password",
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
                            {/* New password */}
                            <div className="mb-2 ">
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 right-0 translate-x-[-50%] translate-y-[-50%] transform cursor-pointer ">
                                        {showNewPassword ? (
                                            <Eye
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        (prevShowPassword) =>
                                                            !prevShowPassword,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <EyeOff
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        (prevShowPassword) =>
                                                            !prevShowPassword,
                                                    )
                                                }
                                            />
                                        )}
                                    </span>
                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`form-input h-12 w-full rounded-sm border text-slate-700 ${
                                            !newPasswordError && newPassword
                                                ? "border-green-500"
                                                : newPasswordError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        } px-4 py-2`}
                                        placeholder="New password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            validateNewPassword(e.target.value);
                                        }}
                                        onBlur={() => {
                                            if (!newPassword) {
                                                // Kiểm tra nếu ô input trống sau khi mất focus
                                                setNewPasswordError(
                                                    "Please enter your new password",
                                                );
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                {newPasswordError && (
                                    <span className="font-semibold text-red-500">
                                        {newPasswordError}
                                    </span>
                                )}
                            </div>
                            {/* Confirm new password */}
                            <div className="mb-2 ">
                                <div className="relative mb-1">
                                    <span className="absolute bottom-0 right-0 translate-x-[-50%] translate-y-[-50%] transform cursor-pointer ">
                                        {showConfirmPassword ? (
                                            <Eye
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (prevShowPassword) =>
                                                            !prevShowPassword,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <EyeOff
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        (prevShowPassword) =>
                                                            !prevShowPassword,
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
                                        className={`form-input h-12 w-full rounded-sm border text-slate-700 ${
                                            !confirmPasswordError &&
                                            confirmPassword
                                                ? "border-green-500"
                                                : confirmPasswordError
                                                  ? "border-red-500"
                                                  : "border-gray-300"
                                        } px-4 py-2`}
                                        placeholder="Confirm new password"
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
                                                    "Please confirm your new password",
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
                            {/* Button */}
                            <button
                                className={`mb-10 mt-6 flex h-12 w-full max-w-52 items-center justify-center gap-0 self-end rounded-sm  py-2 font-bold text-white ${
                                    confirmPasswordError ||
                                    !confirmPassword ||
                                    passwordError ||
                                    !password ||
                                    !newPassword ||
                                    newPasswordError ||
                                    isUpdating
                                        ? "bg-gray-400 "
                                        : "bg-red-500 hover:bg-red-700"
                                }`}
                                onClick={handleUpdatePassword}
                                disabled={
                                    confirmPasswordError ||
                                    passwordError ||
                                    !newPassword ||
                                    newPasswordError ||
                                    !password ||
                                    !confirmPassword ||
                                    isUpdating
                                }
                            >
                                <span>
                                    {" "}
                                    {isUpdating
                                        ? "Updating..."
                                        : "Update new password"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
            {/* Delete Account */}

            <Container className="max-w-[1000px] pb-10 pt-4">
                <div className="flex w-full flex-col rounded-lg bg-white shadow-lg">
                    <div className="mx-8 mt-3 border-b border-gray-300  pb-4 pt-6 ">
                        <p className="text-2xl font-bold text-slate-700">
                            Delete Account
                        </p>
                    </div>
                    <div className="mx-8 pt-6 ">
                        <p className="text-slate-700">
                            Account deletion is a permanent action and cannot be
                            undone. If you are deleting your account due to an
                            excessive email notifications, you can unsubscribe
                            from emails{" "}
                            <span className="cursor-pointer text-blue-700">
                                {" "}
                                here.{" "}
                            </span>
                        </p>
                        {showDeleteUser ? (
                            <div className="mb-10 mt-8">
                                <div className="grid grid-cols-12 gap-3 py-3 ">
                                    <div className="col-span-5  font-semibold text-slate-700">
                                        Enter your current password to confirm
                                        delete account
                                    </div>
                                    <div className="col-span-7 ">
                                        <div className="relative mb-1">
                                            <span className="absolute bottom-0 right-0 translate-x-[-50%] translate-y-[-50%] transform cursor-pointer ">
                                                {showDeletePassword ? (
                                                    <Eye
                                                        onClick={() =>
                                                            setShowDeletePassword(
                                                                (
                                                                    prevShowPassword,
                                                                ) =>
                                                                    !prevShowPassword,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <EyeOff
                                                        onClick={() =>
                                                            setShowDeletePassword(
                                                                (
                                                                    prevShowPassword,
                                                                ) =>
                                                                    !prevShowPassword,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </span>
                                            <input
                                                type={
                                                    showDeletePassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                className={`form-input h-12 w-full rounded-sm border text-slate-700 ${
                                                    !deletePasswordError &&
                                                    deletePassword
                                                        ? "border-green-500"
                                                        : deletePasswordError
                                                          ? "border-red-500"
                                                          : "border-gray-300"
                                                } px-4 py-2`}
                                                placeholder="Current password"
                                                value={deletePassword}
                                                onChange={(e) => {
                                                    setDeletePassword(
                                                        e.target.value,
                                                    );
                                                    validateDeletePassword(
                                                        e.target.value,
                                                    );
                                                }}
                                                onBlur={() => {
                                                    if (!deletePassword) {
                                                        // Kiểm tra nếu ô input trống sau khi mất focus
                                                        setDeletePasswordError(
                                                            "Please enter your current password",
                                                        );
                                                    }
                                                }}
                                                required
                                            />
                                        </div>

                                        {deletePasswordError && (
                                            <span className="font-semibold text-red-500">
                                                {deletePasswordError}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-end gap-5">
                                    <button
                                        className="w-24 rounded-sm border border-slate-700 bg-white px-4 py-1 font-semibold text-slate-700"
                                        onClick={() => setShowDeleteUser(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`w-24 rounded-sm border-0 px-4 py-1 font-semibold text-white ${isDeleting ? "bg-gray-400" : "bg-red-500"}`}
                                        onClick={handleDeleteUser}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Deleting..." : "Confirm"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className={`  mb-10 mt-6 flex h-12 w-full max-w-52 items-center justify-center gap-0  self-end rounded-sm border border-red-500 py-2 font-bold text-red-500 hover:bg-rose-50   
                                `}
                                onClick={() => setShowDeleteUser(true)}
                            >
                                <span>Delete your account</span>
                            </button>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default SettingsAccount;
