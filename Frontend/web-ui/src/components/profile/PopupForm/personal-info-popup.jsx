import React, { useState, useRef, useEffect } from "react";
import { Camera, X } from "lucide-react";

import { db, storage } from "../../../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

import { useAuth } from "../../../contexts/authContext";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { getAuth, updateProfile } from "firebase/auth";

const PersonalInfoPopUp = ({ userInfo, onClose }) => {
    const { currentUser, setCurrentUser } = useAuth();
    const auth = getAuth();

    const defaultAvt =
        "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png";

    // Lấy ngày hiện tại
    const today = new Date();

    // Tính toán ngày mai
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Chuyển đổi ngày mai sang định dạng ISO (YYYY-MM-DD)
    const tomorrowISO = tomorrow.toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        name: userInfo.displayName || "",
        title: userInfo.title || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        dob: userInfo.birthday || "",
        gender: userInfo.gender || "",
        provice: userInfo.provice || "",
        address: userInfo.address || "",
        personalLink: userInfo.personalLink || "",
    });

    const [errors, setErrors] = useState({});
    const [imageFileUpload, setImageFileUpload] = useState(null);
    const [updating, setUpdating] = useState(false);

    const popupRef = useRef(null);

    // Click background close popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // Upload File img
    const uploadPhoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra phần mở rộng của file
        const allowedExtensions = [
            "jfif",
            "pjpeg",
            "jpeg",
            "pjp",
            "jpg",
            "png",
        ];
        const extension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            toast.error(
                "Oops! Please attach a .jfif, .pjpeg, .jpeg, .pjp, .jpg, or .png file",
            );
            return;
        }
        const v4Id = v4(); // Tạo giá trị v4 duy nhất
        // Tạo tên file cho cả Firestore và Storage

        const fileName = `${file.name}_${v4Id}`;
        const fileRef = ref(storage, `photoUrl/${fileName}`);

        try {
            // Tải file lên Storage
            await uploadBytes(fileRef, file);

            // Lấy URL của file vừa upload
            const imageURL = await getDownloadURL(fileRef);
            setImageFileUpload(imageURL);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // get data from form, save in formData object
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Xóa lỗi khi người dùng nhập
    };

    // Kiểm tra các trường bắt buộc
    const validateField = (name, value) => {
        let error = "";
        if (name === "name" && !value) error = "Full name is required";
        if (name === "title" && !value) error = "Title is required";
        if (name === "email" && !value) error = "Email address is required";
        if (name === "phone" && !value) error = "Phone number is required";
        if (name === "dob" && !value) error = "Date of birth is required";
        if (name === "address" && !value) error = "Address is required";
        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra các trường bắt buộc
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            setUpdating(true);
            const profileUpdates = {
                displayName: formData.name,
                phoneNumber: formData.phone,
            };
            // Nếu có hình ảnh được tải lên, thêm trường photoURL vào profileUpdates
            if (imageFileUpload) {
                profileUpdates.photoURL = imageFileUpload;
            }

            // Cập nhật profile của authentication
            await updateProfile(auth.currentUser, profileUpdates);

            // Cập nhật thông tin vào cơ sở dữ liệu Firestore
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(
                userDocRef,
                {
                    displayName: formData.name,
                    title: formData.title,
                    email: formData.email,
                    phone: formData.phone,
                    birthday: formData.dob,
                    gender: formData.gender,
                    address: formData.address,
                    personalLink: formData.personalLink,
                    photoURL: imageFileUpload ? imageFileUpload : null,
                },
                { merge: true },
            ); // Sử dụng merge để cập nhật thông tin mà không ghi đè tài liệu đang tồn tại

            // Handle other form context
            setCurrentUser((prevUser) => ({
                ...prevUser,
                displayName: formData.name,
                title: formData.title,
                email: formData.email,
                phone: formData.phone,
                birthday: formData.dob,
                gender: formData.gender,
                address: formData.address,
                personalLink: formData.personalLink,
                photoURL: imageFileUpload ? imageFileUpload : prevUser.photoURL,
                // Thêm các trường khác tương ứng ở đây nếu cần
            }));
            setUpdating(false);
            toast.success("Update profile successfully ");
            onClose();
        } catch (error) {
            toast.error("Error update user info :", error);
        }
    };

    return (
        <>
            <div
                id="login-popup"
                className="fixed left-0 right-0 top-0 z-[999] flex h-full w-full justify-center bg-black/50  bg-opacity-50"
            >
                <div
                    ref={popupRef}
                    className="mt-8 h-[96%] w-[53%] transform  overflow-auto rounded-lg bg-white p-8 shadow-md transition-all duration-300 ease-in-out "
                >
                    <div className="flex justify-between">
                        <h2 className="mb-4 text-xl font-semibold text-slate-700">
                            Personal details
                        </h2>
                        <button onClick={onClose} className="flex self-start">
                            <X className="h-6 w-6 text-slate-700" />
                        </button>
                    </div>
                    <hr />
                    <div className="mt-8 flex flex-col items-center ">
                        <img
                            className="h-32 w-32 rounded-full object-cover  opacity-100 transition-opacity"
                            src={
                                imageFileUpload
                                    ? imageFileUpload
                                    : userInfo.photoURL
                                      ? userInfo?.photoURL
                                      : defaultAvt
                            }
                            alt="Avatar"
                        />
                        <div className="mt-3 flex flex-row justify-center">
                            <input
                                type="file"
                                onChange={uploadPhoto}
                                style={{ display: "none" }}
                                id="fileInput"
                                accept=".jfif, .pjpeg, .jpeg, .pjp, .jpg, .png"
                            />
                            <label
                                htmlFor="fileInput"
                                className="flex cursor-pointer items-center gap-2"
                            >
                                <Camera className=" stroke-red-600" />
                                <p className=" text-red-600">Edit</p>
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="mb-4">
                            <label className="block text-base font-semibold text-slate-700">
                                Full name
                                <abbr className="ml-1 text-red-500">*</abbr>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-1 w-full rounded border-2 p-2 outline-none ${errors.name ? "border-red-500" : "focus:border-green-500"}`}
                                placeholder="Full name"
                                maxLength="50"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-base font-semibold text-slate-700">
                                Title
                                <abbr className="ml-1 text-red-500">*</abbr>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-1 w-full rounded border-2 p-2 outline-none ${errors.title ? "border-red-500" : "focus:border-green-500"}`}
                                placeholder="Title"
                                maxLength="50"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-base font-semibold text-slate-700">
                                    Email address
                                    <abbr className="ml-1 text-red-500">*</abbr>
                                </label>
                                <input
                                    disabled
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`mt-1 w-full rounded border-2 p-2 outline-none ${errors.email ? "border-red-500" : "focus:border-green-500"}`}
                                    placeholder="Email address"
                                    maxLength="60"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-base font-semibold text-slate-700">
                                    Phone
                                    <abbr className="ml-1 text-red-500">*</abbr>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`mt-1 w-full rounded border-2 p-2 outline-none ${errors.phone ? "border-red-500" : "focus:border-green-500"}`}
                                    placeholder="Phone"
                                    maxLength="11"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-base font-semibold text-slate-700">
                                    Date of Birth
                                    <abbr className="ml-1 text-red-500">*</abbr>
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`mt-1 w-full rounded border-2 p-2 outline-none ${errors.dob ? "border-red-500" : "focus:border-green-500"}`}
                                    placeholder="Date of Birth"
                                    max={tomorrowISO} // Set max value to today's date
                                />
                                {errors.dob && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.dob}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-base font-semibold text-slate-700">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border-2 p-2 outline-none focus:border-green-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-base font-semibold text-slate-700">
                                Address
                                <abbr className="ml-1 text-red-500">*</abbr>
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`mt-1 w-full rounded border-2 p-2 outline-none ${errors.address ? "border-red-500" : "focus:border-green-500"}`}
                                placeholder="Address"
                                maxLength="100"
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-base font-semibold text-slate-700">
                                Personal Link
                            </label>
                            <input
                                type="text"
                                name="personalLink"
                                value={formData.personalLink}
                                onChange={handleChange}
                                className="mt-1 w-full rounded border-2 p-2 outline-none focus:border-green-500"
                                placeholder="Personal Link"
                                maxLength="200"
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onClose}
                                className="rounded bg-white px-8 py-2 text-black"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`rounded  px-8 py-2 text-white ${updating ? "bg-gray-500" : "bg-red-500"}`}
                                disabled={updating}
                            >
                                {updating ? "Updating..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PersonalInfoPopUp;
