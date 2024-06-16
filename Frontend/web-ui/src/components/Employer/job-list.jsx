import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ClipLoader } from "react-spinners";

const JobList = () => {
    const { currentUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [jobs, setJobs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [jobDescription, setJobDescription] = useState("");
    const [jobResponsibility, setJobResponsibility] = useState("");
    const [jobRequirements, setJobRequirements] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getJobList = async () => {
        try {
            const response = await fetch(
                "https://employer-service-otwul2bnna-uc.a.run.app/employer/get-all-jobs",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${currentUser?.accessToken}`,
                    },
                },
            );
            if (response.status === 200) {
                const result = response.json().then((data) => {
                    console.log(data);
                    setJobs(data);
                    setSearchResults(data);
                });
            } else {
                toast.error(
                    "An error occurred while trying to fetch the job list. Please try again",
                );
            }
        } catch {
            console.log("Error");
        }
    };

    const deleteJob = async (employerId, jobId) => {
        try {
            const response = await fetch(
                `https://employer-service-otwul2bnna-uc.a.run.app/employer/delete-job?employerId=${employerId}&jobId=${jobId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${currentUser?.accessToken}`,
                    },
                },
            );
            if (response.status === 200) {
                return response.json().then((data) => {
                    toast.success("Success!");
                    return data;
                });
            } else {
                toast.error(
                    "An error occurred while trying to delete the job. Please try again",
                );
            }
        } catch {
            console.log("Error");
        }
    };

    const updateJob = async (data) => {
        try {
            const response = await fetch(
                `https://employer-service-otwul2bnna-uc.a.run.app/employer/update-job`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `${currentUser?.accessToken}`,
                    },
                    body: JSON.stringify(data),
                },
            );
            if (response.status === 200) {
                return response.json().then((data) => {
                    toast.success("Update successfully!");
                    return data;
                });
            } else {
                return response.json().then((data) => {
                    toast.error(data.title);
                });
            }
        } catch {
            return toast.error(
                "Something wrong happened. Please try again later",
            );
        }
    };

    const handleSearch = (value) => {
        const results = jobs?.filter((item) => {
            return item?.jobTitle.toLowerCase().includes(value.toLowerCase());
        });
        setSearchResults(results);
    };

    const handleDelete = async (id) => {
        const results = searchResults.filter((item) => {
            return item.jobId !== id;
        });
        await deleteJob(currentUser?.uid, id);
        setSearchResults(results);
    };

    const onSubmit = (data, id) => {
        data.jobId = id;
        data.employerId = currentUser?.uid;
        data.jobDescription = jobDescription;
        data.jobResponsibility = jobResponsibility;
        data.jobRequirement = jobRequirements;
        updateJob(data);
    };

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const res = await getJobList();
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <>
            <div className="flex items-center justify-center py-4">
                <div className="flex w-1/2">
                    <Input
                        type="text"
                        onInput={(e) => handleSearch(e.target.value)}
                        placeholder="Search"
                        className="rounded border px-3 py-2"
                    />
                </div>
            </div>

            <div className="min-h-[30rem]">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <ClipLoader
                            color="rgba(239, 68, 68, 1)"
                            size={40}
                            speedMultiplier={1}
                            className="mt-4 "
                        />
                    </div>
                ) : searchResults.length === 0 ? (
                    <p className=" text-center">No results found</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/5">Job ID</TableHead>
                                <TableHead className="w-1/4">
                                    Job Title
                                </TableHead>
                                <TableHead className="w-1/4">
                                    Location
                                </TableHead>
                                <TableHead className="w-1/6">Salary</TableHead>
                                <TableHead className="w-1/8">Status</TableHead>
                                <TableHead className="w-1/7 text-center">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {searchResults.map((item) => (
                                <TableRow key={item?.jobId}>
                                    <TableCell className="font-medium">
                                        {item?.jobId}
                                    </TableCell>
                                    <TableCell>{item?.jobTitle}</TableCell>
                                    <TableCell className="break-words">
                                        {item?.jobLocation}
                                    </TableCell>
                                    <TableCell>{item?.jobSalary}</TableCell>
                                    <TableCell
                                        className={
                                            item?.jobStatus === "approved"
                                                ? "text-green-600"
                                                : item?.jobStatus === "pending"
                                                  ? "text-gray-600"
                                                  : "text-red-600"
                                        }
                                    >
                                        {item?.jobStatus}
                                    </TableCell>
                                    <TableCell className="flex flex-col">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="mb-1 rounded bg-blue-500 px-2 py-1 text-center text-white">
                                                    Edit
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-screen overflow-y-scroll lg:max-w-screen-lg">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Edit job
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-6">
                                                        <div className="relative mb-6">
                                                            <input
                                                                type="text"
                                                                id="job_title"
                                                                {...register(
                                                                    "jobTitle",
                                                                    {
                                                                        required: true,
                                                                    },
                                                                )}
                                                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6 focus:outline focus:outline-[4px] focus:outline-green-200"
                                                                defaultValue={
                                                                    item?.jobTitle
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="job_title"
                                                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3 peer-focus:top-0"
                                                            >
                                                                Job Title
                                                                <span className="ml-1 text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            {errors?.jobTitle && (
                                                                <span className="px-3 text-red-600">
                                                                    This field
                                                                    is required
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="relative mb-6">
                                                            <input
                                                                type="text"
                                                                id="job_location"
                                                                {...register(
                                                                    "jobLocation",
                                                                    {
                                                                        required: true,
                                                                    },
                                                                )}
                                                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                                                defaultValue={
                                                                    item?.jobLocation
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="job_location"
                                                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                                                            >
                                                                Job Location
                                                                <span className="ml-1 text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            {errors?.jobLocation && (
                                                                <span className="px-3 text-red-600">
                                                                    This field
                                                                    is required
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="relative mb-6">
                                                            <input
                                                                type="text"
                                                                id="job_type"
                                                                {...register(
                                                                    "jobType",
                                                                    {
                                                                        required: true,
                                                                    },
                                                                )}
                                                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                                                defaultValue={
                                                                    item?.jobType
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="job_type"
                                                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                                                            >
                                                                Job Type
                                                                <span className="ml-1 text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            {errors?.jobType && (
                                                                <span className="px-3 text-red-600">
                                                                    This field
                                                                    is required
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="relative mb-6">
                                                            <input
                                                                type="text"
                                                                id="job_salary"
                                                                {...register(
                                                                    "jobSalary",
                                                                    {
                                                                        required: true,
                                                                    },
                                                                )}
                                                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                                                defaultValue={
                                                                    item?.jobSalary
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="job_salary"
                                                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                                                            >
                                                                Job Salary
                                                                <span className="ml-1 text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            {errors?.jobSalary && (
                                                                <span className="px-3 text-red-600">
                                                                    This field
                                                                    is required
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="relative mb-6">
                                                            <input
                                                                type="text"
                                                                id="job_skills"
                                                                {...register(
                                                                    "jobSkills",
                                                                    {
                                                                        required: true,
                                                                    },
                                                                )}
                                                                className="focus:outline-solid peer block w-full rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                                                defaultValue={
                                                                    item?.jobSkills
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="job_skills"
                                                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                                                            >
                                                                Job Skills
                                                                <span className="ml-1 text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            {errors?.jobSkills && (
                                                                <span className="px-3 text-red-600">
                                                                    This field
                                                                    is required
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="relative mb-6">
                                                            <textarea
                                                                rows={3}
                                                                type="text"
                                                                id="job_top_reasons"
                                                                {...register(
                                                                    "jobTopReasons",
                                                                    {
                                                                        required: true,
                                                                    },
                                                                )}
                                                                className="focus:outline-solid peer block w-full whitespace-pre-wrap rounded-lg border border-gray-300 px-3 pb-2 pt-6  focus:outline focus:outline-[4px] focus:outline-green-200"
                                                                defaultValue={
                                                                    item?.jobTopReasons
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="job_top_reasons"
                                                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3  peer-focus:top-0"
                                                            >
                                                                Job Top Reasons
                                                                <span className="ml-1 text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            {errors?.jobTopReasons && (
                                                                <span className="px-3 text-red-600">
                                                                    This field
                                                                    is required
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="relative mb-6">
                                                            <textarea
                                                                rows={5}
                                                                type="text"
                                                                id="job_benefits"
                                                                {...register(
                                                                    "jobBenefit",
                                                                    {
                                                                        required: true,
                                                                    },
                                                                )}
                                                                className="focus:outline-solid peer block w-full whitespace-pre-wrap rounded-lg border border-gray-300 px-3 pb-2 pt-6 focus:outline focus:outline-[4px] focus:outline-green-200"
                                                                defaultValue={
                                                                    item?.jobBenefits
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="job_benefits"
                                                                className="absolute left-3 top-0 my-2 px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:left-3 peer-placeholder-shown:top-2.5 peer-focus:left-3 peer-focus:top-0"
                                                            >
                                                                Job Benefits
                                                                <span className="ml-1 text-red-500">
                                                                    *
                                                                </span>
                                                            </label>
                                                            {errors?.jobBenefit && (
                                                                <span className="px-3 text-red-600">
                                                                    This field
                                                                    is required
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <label
                                                                htmlFor="job_description"
                                                                className="mb-2 block font-medium"
                                                            >
                                                                Job Description
                                                            </label>
                                                            <CKEditor
                                                                onReady={(
                                                                    editor,
                                                                ) => {
                                                                    editor.editing.view.change(
                                                                        (
                                                                            writer,
                                                                        ) => {
                                                                            writer.setStyle(
                                                                                "height",
                                                                                "8rem",
                                                                                editor.editing.view.document.getRoot(),
                                                                            );
                                                                        },
                                                                    );
                                                                    editor.setData(
                                                                        item?.jobDescription,
                                                                    );
                                                                }}
                                                                editor={
                                                                    ClassicEditor
                                                                }
                                                                data={
                                                                    item?.jobDescription
                                                                }
                                                                onChange={(
                                                                    event,
                                                                    editor,
                                                                ) => {
                                                                    setJobDescription(
                                                                        editor.getData(),
                                                                    );
                                                                }}
                                                                className="rounded-lg border border-gray-300"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label
                                                                htmlFor="job_responsibility"
                                                                className="mb-2 block font-medium"
                                                            >
                                                                Job
                                                                Responsibility
                                                            </label>
                                                            <CKEditor
                                                                onReady={(
                                                                    editor,
                                                                ) => {
                                                                    editor.editing.view.change(
                                                                        (
                                                                            writer,
                                                                        ) => {
                                                                            writer.setStyle(
                                                                                "height",
                                                                                "8rem",
                                                                                editor.editing.view.document.getRoot(),
                                                                            );
                                                                        },
                                                                    );
                                                                    editor.setData(
                                                                        item?.jobResponsibility,
                                                                    );
                                                                }}
                                                                editor={
                                                                    ClassicEditor
                                                                }
                                                                data={
                                                                    item?.jobResponsibility
                                                                }
                                                                onChange={(
                                                                    event,
                                                                    editor,
                                                                ) => {
                                                                    setJobResponsibility(
                                                                        editor.getData(),
                                                                    );
                                                                }}
                                                                className="rounded-lg border border-gray-300"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label
                                                                htmlFor="job_requirements"
                                                                className="mb-2 block font-medium"
                                                            >
                                                                Job Requirements
                                                            </label>
                                                            <CKEditor
                                                                onReady={(
                                                                    editor,
                                                                ) => {
                                                                    editor.editing.view.change(
                                                                        (
                                                                            writer,
                                                                        ) => {
                                                                            writer.setStyle(
                                                                                "height",
                                                                                "8rem",
                                                                                editor.editing.view.document.getRoot(),
                                                                            );
                                                                        },
                                                                    );
                                                                    editor.setData(
                                                                        item?.jobRequirement,
                                                                    );
                                                                }}
                                                                editor={
                                                                    ClassicEditor
                                                                }
                                                                data={
                                                                    item?.jobRequirement
                                                                }
                                                                onChange={(
                                                                    event,
                                                                    editor,
                                                                ) => {
                                                                    setJobRequirements(
                                                                        editor.getData(),
                                                                    );
                                                                }}
                                                                className="rounded-lg border border-gray-300"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        onClick={handleSubmit(
                                                            (data) => {
                                                                onSubmit(
                                                                    data,
                                                                    item?.jobId,
                                                                );
                                                            },
                                                        )}
                                                    >
                                                        Save changes
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <button
                                            className="rounded bg-red-500 px-2 py-1 text-center text-white"
                                            onClick={(e) =>
                                                handleDelete(item?.jobId)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
};

export default JobList;
