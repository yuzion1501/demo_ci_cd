/*
{
  "employerId": "string",
  "companyName": "string",
  "companyType": "string",
  "companySize": "string",
  "country": "string",
  "workingDays": "string",
  "overtimePolicy": "string",
  "companyOverview": "string",
  "keySkills": "string",
  "whyLoveWorkingHere": "string",
  "logoUrl": "string",
  "location": "string",
  "workType": "string",
  "images": [
    "string"
  ]
}
*/

import React from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "@/contexts/authContext";

import { Input } from "../ui/input.jsx";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ClipLoader } from "react-spinners";

import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const companyTypeData = [
    { value: "IT Product", label: "IT Product" },
    { value: "IT Outsourcing", label: "IT Outsourcing" },
];

const companySizeData = [
    { value: "1-20", label: "1-20" },
    { value: "21-50", label: "21-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-200", label: "101-200" },
    { value: "201-500", label: "201-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1000+", label: "1000+" },
];

const workingDaysData = [
    { value: "Monday - Friday", label: "Monday - Friday" },
    { value: "Monday - Saturday", label: "Monday - Saturday" },
];

const overtimePolicyData = [
    { value: "Yes", label: "Yes" },
    { value: "No OT", label: "No OT" },
];

const EmployerProfile = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const { currentUser } = useAuth();

    const [companyName, setCompanyName] = useState("");
    const [companyType, setCompanyType] = useState(companyTypeData[0]);
    const [companySize, setCompanySize] = useState(companySizeData[0]);
    const [country, setCountry] = useState("");
    const [workingDays, setWorkingDays] = useState(workingDaysData[0]);
    const [overtimePolicy, setOvertimePolicy] = useState(overtimePolicyData[0]);
    const [companyOverview, setCompanyOverview] = useState("");
    const [whyLoveWorkingHere, setWhyLoveWorkingHere] = useState("");
    const [keyskills, setKeyskills] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data) => {
        // Here, you can send the form data to the server using fetch or Axios
        data.employerId = currentUser.uid;
        data.companyType = companyType.value;
        data.companySize = companySize.value;
        data.workingDays = workingDays.value;
        data.overtimePolicy = overtimePolicy.value;
        data.companyOverview = companyOverview;
        data.whyLoveWorkingHere = whyLoveWorkingHere;
        data.logoUrl = logoUrl;
        console.log(data);
        updateProfile(data);
    };

    const getEmployerInfo = async () => {
        try {
            const response = await fetch(
                "https://employer-service-otwul2bnna-uc.a.run.app/employer/get",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${currentUser?.accessToken}`,
                    },
                },
            );
            if (response.status === 200) {
                const data = await response.json();
                setCompanyName(data?.companyName);
                setCompanyOverview(data?.companyOverview);
                setCompanySize(
                    companySizeData.filter(
                        (value) => value.value === data?.companySize,
                    )[0],
                );
                setCompanyType(
                    companyTypeData.filter((value) =>
                        value.value.includes(data?.companyType),
                    )[0],
                );
                setWorkingDays(
                    workingDaysData.filter(
                        (value) => value.value === data?.workingDays,
                    )[0],
                );
                setCountry(data?.country);
                setKeyskills(data?.keySkills);
                setLocation(data?.location);
                setOvertimePolicy(
                    overtimePolicyData.filter((value) =>
                        value.value.includes(data?.overtimePolicy),
                    )[0],
                );
                setWhyLoveWorkingHere(data?.whyLoveWorkingHere);
            } else {
                toast.error("Something happened while fetching the data");
            }
        } catch {
            console.log("Error");
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await fetch(
                `https://employer-service-otwul2bnna-uc.a.run.app/employer/update`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: currentUser?.accessToken,
                    },
                    body: JSON.stringify(data),
                },
            );
            if (response.status === 200) {
                // Create a reference to the document
                const employerRef = doc(db, "users", currentUser.uid);
                // Update the status field
                await updateDoc(employerRef, {
                    company: data.companyName,
                    workLocation: data.location,
                });

                toast.success("Profile updated successfully");
            } else {
                toast.error("Update profile failed");
            }
        } catch {
            toast.error("Something happened while updating profile");
        }
    };

    const handleFileChange = async (event) => {
      updateLogo(event.target.files[0]);
    };

    const updateLogo = async (data) => {
      const formData = new FormData();
      formData.append("file", data);

        try {
            const response = await fetch(
                `https://employer-service-otwul2bnna-uc.a.run.app/images/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: currentUser?.accessToken,
                    },
                    body: formData,
                },
            );

            if (response.status === 200) {
                const data = await response.json();
                setLogoUrl(data?.url);
            } else {
                toast.error("Failed to convert file to link");
            }
        } catch (error) {
            toast.error("Error:", error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const res = await getEmployerInfo();
            reset(res);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <>
            {isLoading ? (
                <div className="flex h-screen items-center justify-center">
                    <ClipLoader
                        color="rgba(239, 68, 68, 1)"
                        size={40}
                        speedMultiplier={1}
                        className="mt-4 "
                    />
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                    <div className="col-span-2 space-y-6">
                        <div className="relative mb-6">
                            <input
                                type="text"
                                id="company_name"
                                {...register("companyName", { required: true })}
                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                defaultValue={companyName}
                            />
                            <label
                                htmlFor="company_name"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                            >
                                Company Name
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            {errors.companyName && (
                                <span className="px-3 text-red-600">
                                    This field is required
                                </span>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="company_overview"
                                className="mb-2 block font-medium"
                            >
                                Company Overview
                            </label>
                            <CKEditor
                                onReady={(editor) => {
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle(
                                            "height",
                                            "15rem",
                                            editor.editing.view.document.getRoot(),
                                        );
                                    });
                                    editor.setData(companyOverview);
                                }}
                                editor={ClassicEditor}
                                data={companyOverview}
                                onChange={(event, editor) => {
                                    setCompanyOverview(editor.getData());
                                }}
                                id="company_overview"
                                className="rounded-lg border border-gray-300"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="why_love_working_here"
                                className="mb-2 block font-medium"
                            >
                                Why People Would Love To Work At Your Company
                            </label>
                            <CKEditor
                                onReady={(editor) => {
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle(
                                            "height",
                                            "15rem",
                                            editor.editing.view.document.getRoot(),
                                        );
                                    });
                                    editor.setData(whyLoveWorkingHere);
                                }}
                                editor={ClassicEditor}
                                data={whyLoveWorkingHere}
                                onChange={(event, editor) => {
                                    setWhyLoveWorkingHere(editor.getData());
                                }}
                                id="why_love_working_here"
                                className="rounded-lg border border-gray-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="relative w-full rounded-lg border border-gray-300 bg-white">
                            <Select
                                value={companyType}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        border: "none",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        border: "none",
                                        width: "97.5%",
                                        top: "90%",
                                    }),
                                }}
                                id="company_type"
                                className="focus:outline-solid peer block w-full px-2 pb-2 pt-8 focus:outline focus:outline-[4px] focus:outline-green-200"
                                placeholder="Company Type"
                                onChange={(val) => {
                                    setCompanyType(val);
                                }}
                                options={companyTypeData}
                            />
                            <label
                                htmlFor="company_type"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3 peer-focus:top-0"
                            >
                                Company Type
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                        </div>
                        {companyType === "" && (
                            <span className="px-3 text-red-600">
                                This field is required
                            </span>
                        )}

                        <div className="relative w-full rounded-lg border border-gray-300 bg-white">
                            <Select
                                value={companySize}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        border: "none",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        width: "97.5%",
                                        border: "none",
                                        top: "90%",
                                    }),
                                }}
                                id="company_size"
                                className="focus:outline-solid peer block w-full px-2 pb-2 pt-8 focus:outline focus:outline-[4px] focus:outline-green-200"
                                placeholder="Company Size"
                                onChange={(val) => {
                                    setCompanySize(val);
                                }}
                                options={companySizeData}
                            />

                            <label
                                htmlFor="company_size"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3 peer-focus:top-0"
                            >
                                Company Size
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                        </div>
                        {companySize === "" && (
                            <span className="px-3 text-red-600">
                                This field is required
                            </span>
                        )}

                        <div className="relative mb-6">
                            <input
                                type="text"
                                id="country"
                                {...register("country", { required: true })}
                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                defaultValue={country}
                            />
                            <label
                                htmlFor="country"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                            >
                                Country
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            {errors.country && (
                                <span className="px-3 text-red-600">
                                    This field is required
                                </span>
                            )}
                        </div>

                        <div className="relative w-full rounded-lg border border-gray-300 bg-white">
                            <Select
                                value={workingDays}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        border: "none",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        border: "none",
                                        width: "97.5%",
                                        top: "90%",
                                    }),
                                }}
                                id="working_days"
                                className="focus:outline-solid peer block w-full px-2 pb-2 pt-8 focus:outline focus:outline-[4px] focus:outline-green-200"
                                placeholder="Working Days"
                                onChange={(val) => {
                                    setWorkingDays(val);
                                }}
                                options={workingDaysData}
                            />
                            <label
                                htmlFor="working_days"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3 peer-focus:top-0"
                            >
                                Working Days
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                        </div>
                        {workingDays === "" && (
                            <span className="px-3 text-red-600">
                                This field is required
                            </span>
                        )}

                        <div className="relative w-full rounded-lg border border-gray-300 bg-white">
                            <Select
                                value={overtimePolicy}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        border: "none",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        width: "97.5%",
                                        border: "none",
                                        top: "90%",
                                    }),
                                }}
                                id="overtime_policy"
                                className="focus:outline-solid peer block w-full px-2 pb-2 pt-8 focus:outline focus:outline-[4px] focus:outline-green-200"
                                placeholder="Overtime Policy"
                                onChange={(val) => {
                                    setOvertimePolicy(val);
                                }}
                                options={overtimePolicyData}
                            />
                            <label
                                htmlFor="overtime_policy"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3 peer-focus:top-0"
                            >
                                Overtime Policy
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                        </div>
                        {overtimePolicy === "" && (
                            <span className="px-3 text-red-600">
                                This field is required
                            </span>
                        )}

                        <div className="relative mb-6">
                            <input
                                type="text"
                                id="key_skills"
                                {...register("keySkills", { required: true })}
                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                defaultValue={keyskills}
                            />
                            <label
                                htmlFor="key_skills"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                            >
                                Key Skills
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            {errors.keySkills && (
                                <span className="px-3 text-red-600">
                                    This field is required
                                </span>
                            )}
                        </div>

                        <div className="relative w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-6">
                            <Input
                                type="file"
                                id="logo_url"
                                {...register("logoUrl", { required: true })}
                                className="focus:outline-solid peer block w-full border-none focus:outline  focus:outline-[4px] focus:outline-green-200"
                                placeholder=" "
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="logo_url"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                            >
                                Company Logo
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                        </div>
                        {errors.logoUrl && (
                            <span className="px-3 text-red-600">
                                This field is required
                            </span>
                        )}

                        <div className="relative mb-6">
                            <input
                                type="text"
                                id="location"
                                {...register("location", { required: true })}
                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                defaultValue={location}
                            />
                            <label
                                htmlFor="location"
                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                            >
                                Location
                                <span className="ml-1 text-red-500">*</span>
                            </label>
                            {errors.location && (
                                <span className="text-red-600">
                                    This field is required
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="col-span-3 mt-4 rounded-md bg-[#ED1B2F] px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </form>
            )}
        </>
    );
};

export default EmployerProfile;
