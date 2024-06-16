import React, { useState, useRef, useEffect } from "react";
// import { writeEmployee, readEmployee,Employee } from "../employee-transaction";
import { X } from "lucide-react";

const EducationPopup = ({ userInfo, onClose }) => {
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

    const [formData, setFormData] = useState({
        school: "",
        major: "",
        currentlyStudy: false,
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        additionalDetail: "",
    });
    const [errors, setErrors] = useState({});

    // get data from form, save in formData object
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // send or handle data in server
        onClose();
    };

    return (
        <div
            id="work-experience-popup"
            className="fixed left-0 right-0 top-0 z-[999] flex h-full w-full items-center justify-center bg-black/50"
        >
            <div
                ref={popupRef}
                className="mt-10 flex h-[75%] max-h-[90vh] w-[50%] flex-col justify-between overflow-auto  rounded-lg bg-white p-8 shadow-md transition-all duration-300 ease-in-out"
            >
                <div className="flex items-center justify-between">
                    <h2 className=" text-xl font-semibold text-slate-700">
                        Education
                    </h2>
                    <button onClick={onClose}>
                        <X className="h-6 w-6 text-slate-700" />
                    </button>
                </div>
                <hr />
                <br></br>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">School</label>
                        <input
                            type="text"
                            name="school"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded border p-2 ${errors.jobTitle ? "border-red-500" : "border-gray-300"}`}
                            placeholder="school"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Major</label>
                        <input
                            type="text"
                            name="major"
                            value={formData.company}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded border p-2 ${errors.company ? "border-red-500" : "border-gray-300"}`}
                            placeholder="major"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            <input
                                type="checkbox"
                                name="currentlyStudy"
                                checked={formData.currentlyStudy}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            I am currently studying here
                        </label>
                    </div>
                    <div className="mb-4 flex">
                        <div className="mr-4">
                            <label className="block text-gray-700">From</label>
                            <select
                                name="fromMonth"
                                value={formData.fromMonth}
                                onChange={handleChange}
                                className={`mt-1 w-full rounded border p-2 ${errors.fromMonth ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Month</option>
                                {/* Add month options */}
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mr-4">
                            <label className="block text-gray-700">Year</label>
                            <select
                                name="fromYear"
                                value={formData.fromYear}
                                onChange={handleChange}
                                className={`mt-1 w-full rounded border p-2 ${errors.fromYear ? "border-red-500" : "border-gray-300"}`}
                            >
                                <option value="">Year</option>
                                {/* Add year options */}
                                {Array.from({ length: 50 }, (_, i) => (
                                    <option key={2024 - i} value={2024 - i}>
                                        {2024 - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!formData.currentlyWorking && (
                            <>
                                <div className="mr-4">
                                    <label className="block text-gray-700">
                                        To
                                    </label>
                                    <select
                                        name="toMonth"
                                        value={formData.toMonth}
                                        onChange={handleChange}
                                        className={`mt-1 w-full rounded border p-2 ${errors.toDate ? "border-red-500" : "border-gray-300"}`}
                                    >
                                        <option value="">Month</option>
                                        {/* Add month options */}
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700">
                                        Year
                                    </label>
                                    <select
                                        name="toYear"
                                        value={formData.toYear}
                                        onChange={handleChange}
                                        className={`mt-1 w-full rounded border p-2 ${errors.toDate ? "border-red-500" : "border-gray-300"}`}
                                    >
                                        <option value="">Year</option>
                                        {/* Add year options */}
                                        {Array.from({ length: 50 }, (_, i) => (
                                            <option
                                                key={2024 - i}
                                                value={2024 - i}
                                            >
                                                {2024 - i}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Additonal details
                        </label>
                        <textarea
                            name="additionalDetail"
                            value={formData.additionalDetail}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded border p-2 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Description"
                            rows="5"
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded bg-white px-8 py-2 text-black"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-red-500 px-8 py-2 text-white"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationPopup;
