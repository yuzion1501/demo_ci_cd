import Container from "@/components/layout/container";
import { useState, useEffect } from "react";

import { CircleAlert, PenLine, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/authContext";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    getAuth,
    updateProfile,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    deleteUser,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { db } from "../../firebase/firebase";
import { setDoc, doc, deleteDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";

const capitalized = (letter) => {
    return letter.charAt(0).toUpperCase() + letter.slice(1);
};

const SettingsAccount = () => {
    const { currentUser, setCurrentUser, isGoogleUser } = useAuth();
    const auth = getAuth();

    const navigate = useNavigate();

    const [userName, setUserName] = useState(
        currentUser?.displayName ? currentUser.displayName : "",
    );
    const [userNameError, setUserNameError] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showUpdateUserName, setShowUpdateUserName] = useState(false);
    const [showDeleteUser, setShowDeleteUser] = useState(false);

    const [deletePassword, setDeletePassword] = useState("");
    const [deletePasswordError, setDeletePasswordError] = useState(false);
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    // Updating Username
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    // Updating Password
    const [isUpdating, setIsUpdating] = useState(false);
    // Delete User
    const [isDeleting, setIsDeleting] = useState(false);

    const validateName = (name) => {
        if (!name) {
            setUserNameError("Please enter your username");
            return false;
        } else {
            setUserNameError("");
            return true;
        }
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

    const handleUpdateUserName = async (e) => {
        e.preventDefault();
        setIsUpdatingName(true);
        try {
            if (userName === currentUser?.displayName) {
                setShowUpdateUserName(false);
                return;
            }

            // Cập nhật profile của authentication
            await updateProfile(auth.currentUser, {
                displayName: userName,
            });

            // Cập nhật thông tin vào cơ sở dữ liệu Firestore
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(
                userDocRef,
                {
                    displayName: userName,
                },
                { merge: true },
            );

            // Handle other form context
            setCurrentUser((prevUser) => ({
                ...prevUser,
                displayName: userName,
            }));
            setShowUpdateUserName(false);
            toast.success("Updating Username successfully!");
        } catch (error) {
            console.error(error);
            // Kiểm tra lỗi của updateProfile
            if (error.code && error.code.startsWith("auth/")) {
                switch (error.code) {
                    case "auth/requires-recent-login":
                        toast.error(
                            "Your session has expired. Please log in again and try to update your username.",
                        );
                        break;
                    case "auth/user-not-found":
                        toast.error(
                            "User not found. Please check your user data and try again.",
                        );
                        break;
                    default:
                        toast.error(
                            `Failed to update profile: ${error.message}`,
                        );
                        break;
                }
            }
            // Kiểm tra lỗi của setDoc
            else if (error.code && error.code.startsWith("firestore/")) {
                switch (error.code) {
                    case "firestore/permission-denied":
                        toast.error(
                            "You don't have permission to update this data.",
                        );
                        break;
                    case "firestore/unavailable":
                        toast.error(
                            "Firestore service is currently unavailable. Please try again later.",
                        );
                        break;
                    default:
                        toast.error(
                            `Failed to update Firestore: ${error.message}`,
                        );
                        break;
                }
            } else {
                toast.error(`Something went wrong: ${error.message}`);
            }
        } finally {
            setIsUpdatingName(false);
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

            const userId = auth.currentUser.uid; // Lưu UID của người dùng hiện tại

            // Xóa tài khoản người dùng
            await deleteUser(auth.currentUser);

            // Xóa tài liệu người dùng từ Firestore
            const userDocRef = doc(db, "users", userId);
            await deleteDoc(userDocRef);
            navigate("/");
            toast.success("Account deleted successfully!");
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

    // user google
    const handleDeleteUserGoogle = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        try {
            // Create Google auth provider
            const provider = new GoogleAuthProvider();

            // Sign in with popup to reauthenticate user
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);

            if (!credential) {
                throw new Error(
                    "No credential found from Google sign-in result.",
                );
            }

            // Reauthenticate the user with the credential
            await reauthenticateWithCredential(auth.currentUser, credential);

            const userId = auth.currentUser.uid; // Lưu UID của người dùng hiện tại

            // Delete the user account
            await deleteUser(auth.currentUser);
            // Xóa tài liệu người dùng từ Firestore
            const userDocRef = doc(db, "users", userId);
            await deleteDoc(userDocRef);

            navigate("/");
            toast.success("Account deleted successfully!");
        } catch (error) {
            console.error(error);

            if (error.code && error.code.startsWith("auth/")) {
                switch (error.code) {
                    case "auth/requires-recent-login":
                        toast.error(
                            "Your session has expired. Please log in again and try to delete your account.",
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
            {/* Account */}
            <Container className="max-w-[1000px] pb-4 pt-4">
                <div className="mt-4 flex w-full flex-col rounded-lg bg-white shadow-lg">
                    <div className="mx-8 mt-3 border-b border-gray-300  pb-4 pt-6 ">
                        <p className="text-2xl font-bold text-slate-700">
                            My Account
                        </p>
                    </div>
                    {/* UserName */}
                    <div className="mx-8 border-b border-gray-300  pb-4 pt-6 ">
                        <p className="text-xl font-bold text-slate-700">
                            General Information
                        </p>
                        <div className="my-4 grid grid-cols-12">
                            <div className="col-span-3 font-semibold text-slate-700">
                                Email :
                            </div>
                            <div className="col-span-9 flex items-center gap-2 text-slate-700">
                                <span>{currentUser?.email}</span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <CircleAlert className="h-4 w-4 text-gray-400" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[180px] bg-slate-800 px-4 py-2 text-center text-xs font-bold text-white">
                                            <span>
                                                You can't change your login
                                                email
                                            </span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <div className="my-4 grid grid-cols-12">
                            <div className="col-span-3 font-semibold text-slate-700">
                                Username :
                            </div>
                            {showUpdateUserName ? (
                                <div className="col-span-9 flex flex-col justify-center gap-2 text-slate-700">
                                    <div className="flex flex-col justify-center gap-1">
                                        <input
                                            className={`form-input h-10 w-full rounded-sm border ${
                                                !userNameError &&
                                                userName !==
                                                    currentUser?.displayName
                                                    ? "border-green-500"
                                                    : userNameError
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                            } px-4 py-2`}
                                            type="text"
                                            placeholder={userName}
                                            value={userName}
                                            onChange={(e) => {
                                                setUserName(e.target.value);
                                                validateName(e.target.value);
                                            }}
                                            onBlur={() => {
                                                if (!userName) {
                                                    // Kiểm tra nếu ô input trống sau khi mất focus
                                                    setUserNameError(
                                                        "Please enter your username",
                                                    );
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
                                    <div className="mt-2 flex justify-end gap-5">
                                        <button
                                            className="w-24 rounded-sm border border-slate-700 bg-white px-4 py-1 font-semibold text-slate-700"
                                            onClick={() =>
                                                setShowUpdateUserName(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className={`w-24 rounded-sm border-0 px-4 py-1 font-semibold text-white ${isUpdatingName ? "bg-gray-400" : "bg-red-500"}`}
                                            onClick={handleUpdateUserName}
                                            disabled={isUpdatingName}
                                        >
                                            {isUpdatingName
                                                ? "Updating..."
                                                : "Save"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="col-span-9 flex items-center gap-2 text-slate-700">
                                    <span>
                                        {capitalized(currentUser?.displayName)}
                                    </span>
                                    <PenLine
                                        className="h-4 w-4 cursor-pointer text-red-500"
                                        onClick={() =>
                                            setShowUpdateUserName(true)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* UpdatePassword */}
                    {!isGoogleUser && (
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
                                                        setShowPassword(
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
                                                showPassword
                                                    ? "text"
                                                    : "password"
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
                                                validatePassword(
                                                    e.target.value,
                                                );
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
                                                        setShowNewPassword(
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
                                                validateNewPassword(
                                                    e.target.value,
                                                );
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
                                                        setShowConfirmPassword(
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
                                                setConfirmPassword(
                                                    e.target.value,
                                                );
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
                    )}
                </div>
            </Container>
            {/* Delete Account */}
            {!isGoogleUser ? (
                <Container className="max-w-[1000px] pb-10 pt-4">
                    <div className="flex w-full flex-col rounded-lg bg-white shadow-lg">
                        <div className="mx-8 mt-3 border-b border-gray-300  pb-4 pt-6 ">
                            <p className="text-2xl font-bold text-slate-700">
                                Delete Account
                            </p>
                        </div>
                        <div className="mx-8 pt-6 ">
                            <p className="text-slate-700">
                                Account deletion is a permanent action and
                                cannot be undone. If you are deleting your
                                account due to an excessive email notifications,
                                you can unsubscribe from emails{" "}
                                <span className="cursor-pointer text-blue-700">
                                    {" "}
                                    here.{" "}
                                </span>
                            </p>
                            {showDeleteUser ? (
                                <div className="mb-10 mt-8">
                                    <div className="grid grid-cols-12 gap-3 py-3 ">
                                        <div className="col-span-5  font-semibold text-slate-700">
                                            Enter your current password to
                                            confirm delete account
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
                                            onClick={() =>
                                                setShowDeleteUser(false)
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className={`w-24 rounded-sm border-0 px-4 py-1 font-semibold text-white ${isDeleting ? "bg-gray-400" : "bg-red-500"}`}
                                            onClick={handleDeleteUser}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting
                                                ? "Deleting..."
                                                : "Confirm"}
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
            ) : (
                <Container className="max-w-[1000px] pb-10 pt-4">
                    <div className="flex w-full flex-col rounded-lg bg-white shadow-lg">
                        <div className="mx-8 mt-3 border-b border-gray-300  pb-4 pt-6 ">
                            <p className="text-2xl font-bold text-slate-700">
                                Delete Account
                            </p>
                        </div>
                        <div className="mx-8 pt-6 ">
                            <p className="text-slate-700">
                                Account deletion is a permanent action and
                                cannot be undone. If you are deleting your
                                account due to an excessive email notifications,
                                you can unsubscribe from emails{" "}
                                <span className="cursor-pointer text-blue-700">
                                    {" "}
                                    here.{" "}
                                </span>
                            </p>
                            <button
                                className={`  mb-10 mt-6 flex h-12 w-full max-w-52 items-center justify-center gap-0  self-end rounded-sm border border-red-500 py-2 font-bold text-red-500 hover:bg-rose-50   
                                `}
                                onClick={handleDeleteUserGoogle}
                                disabled={isDeleting}
                            >
                                <span>
                                    {isDeleting
                                        ? "Deleting..."
                                        : "Delete your account"}
                                </span>
                            </button>
                        </div>
                    </div>
                </Container>
            )}
        </div>
    );
};

export default SettingsAccount;
