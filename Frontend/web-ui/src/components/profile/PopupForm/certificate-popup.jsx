import React, { useState, useRef, useEffect } from "react";
// import { writeEmployee, readEmployee,Employee } from "../employee-transaction";
import { X } from "lucide-react";

const CertificatePopup = ({ userInfo, onClose }) => {
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
        certificateName: "",
        organization: "",
        fromMonth: "",
        fromYear: "",
        certificateURL: "",
        description: "",
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
                        Work Experience
                    </h2>
                    <button onClick={onClose}>
                        <X className="h-6 w-6 text-slate-700" />
                    </button>
                </div>
                <hr />
                <br></br>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Certificate Name
                        </label>
                        <input
                            type="text"
                            name="certificateName"
                            value={formData.certificateName}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded border p-2 `}
                            placeholder="certificate Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Organization
                        </label>
                        <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded border p-2 `}
                            placeholder="organization"
                        />
                    </div>
                    {/* <div className="mb-4">
            <label className="block text-gray-700">
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={formData.currentlyWorking}
                onChange={handleChange}
                className="mr-2"
              />
              I am currently Working here
            </label>
          </div> */}
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
                    </div>
                    <div className="mb-4">
                        <label className="block text-base font-semibold text-slate-700">
                            Certificate URL
                        </label>
                        <input
                            type="text"
                            name="certificateURL"
                            value={formData.certificateURL}
                            onChange={handleChange}
                            className="mt-1 w-full rounded border-2 p-2 outline-none focus:border-green-500 peer-required:border-red-500"
                            placeholder="certificate URL"
                            maxLength="200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded border p-2 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                            placeholder="description"
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

export default CertificatePopup;
