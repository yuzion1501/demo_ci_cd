import React, { useEffect, useState } from "react";
import CompanyInfo from "@/components/ui/job-detail-guest/company-info";
import JobDetailsSection from "@/components/ui/job-detail-guest/job-details-section";
import BasicInfo from "@/components/ui/job-detail-guest/basic-info";
import { useAuth } from "@/contexts/authContext"; // Adjust import as necessary
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner

const JobDetail = ({ job, onBack }) => {
    const [isSticky, setIsSticky] = useState(true);
    const [jobStatus, setJobStatus] = useState(job.jobStatus);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY <= 800);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleApprove = async () => {
        if (window.confirm("Are you sure you want to approve this job?")) {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://job-service.azurewebsites.net/job/approve/${job.jobId}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `${currentUser.accessToken}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to approve job");
                }

                const result = await response.json();
                console.log("Job approved successfully:", result);
                setJobStatus("approved"); // Update job status in UI
            } catch (error) {
                console.error("Error approving job:", error);
                alert("Failed to approve job. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReject = async () => {
        if (window.confirm("Are you sure you want to reject this job?")) {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://job-service.azurewebsites.net/job/reject/${job.jobId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${currentUser.accessToken}`,
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error("Failed to reject job");
                }

                const result = await response.json();
                console.log("Job rejected successfully:", result);
                setJobStatus("rejected"); // Update job status in UI
            } catch (error) {
                console.error("Error rejecting job:", error);
                alert("Failed to reject job. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const canApprove = jobStatus !== "approved";
    const canReject = jobStatus !== "rejected";

    return (
        <div className="relative bg-gray-200 bg-opacity-50 p-[30px] pb-[150px]">
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <ClipLoader color="#ffffff" size={50} />
                </div>
            )}
            <button onClick={onBack} className="mb-4 text-blue-500">
                Back to Job Management
            </button>

            <div className="relative grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <div className="sticky top-[60px]">
                        <div className="mb-4 rounded-lg bg-white p-4 shadow-lg">
                            {canApprove && (
                                <button
                                    onClick={handleApprove}
                                    className="mb-4 w-full rounded-md bg-green-500 px-4 py-2 text-white shadow-lg transition duration-200 hover:bg-green-600"
                                    disabled={loading}
                                >
                                    Approve
                                </button>
                            )}
                            {canReject && (
                                <button
                                    onClick={handleReject}
                                    className="w-full rounded-md bg-red-500 px-4 py-2 text-white shadow-lg transition duration-200 hover:bg-red-600"
                                    disabled={loading}
                                >
                                    Reject
                                </button>
                            )}
                        </div>
                        <CompanyInfo job_detail={job} />
                    </div>
                </div>

                <div className="col-span-2 pb-8">
                    <div
                        className={`top-[60px] rounded-t-md bg-white ${
                            isSticky ? "sticky" : ""
                        }`}
                        style={{ zIndex: 1 }}
                    >
                        <div className="p-4">
                            <h1 className="text-2xl font-bold">
                                {job.jobTitle}
                            </h1>
                            <p className="text-gray-600">{job.jobLocation}</p>
                            <p className="text-gray-600">{job.jobType}</p>
                            <p className="text-gray-600">{job.postedAt}</p>
                        </div>
                    </div>

                    <BasicInfo job_detail={job} />

                    <div id="job-detail-section">
                        <JobDetailsSection job_detail={job} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .similar-jobs-title {
                    color: #121212;
                    width: 100%;
                    margin-top: 30px;
                    font:
                        700 22px Lexend,
                        sans-serif;
                }
                @media (max-width: 991px) {
                    .similar-jobs-title {
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobDetail;
