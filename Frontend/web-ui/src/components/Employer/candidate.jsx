import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import CandidateItem from "./candidate-item";
import ClipLoader from "react-spinners/ClipLoader";

import { useAuth } from "@/contexts/authContext";
import PropTypes from "prop-types";

const statusOptions = {
    in_review: "CV received",
    accepted: "Accepted",
    rejected: "Rejected",
};

const Candidates = ({ onCVViewer }) => {
    const { currentUser } = useAuth();
    console.log("currentUser: ", currentUser);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [jobOptions, setJobOptions] = useState([]); //exapmle jobOptions

    const [selectedJob, setSelectedJob] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [filterResults, setFilterResults] = useState([]);
    const [candidates, setCandidates] = useState([]); //example candidates
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const candidatesPerPage = 3;

    const fetchCompanyData = async () => {
        try {
            const response = await fetch(
                `https://employer-service-otwul2bnna-uc.a.run.app/employer/get`,
                {
                    headers: {
                        Authorization: currentUser?.accessToken,
                    },
                },
            );
            const data = await response.json();
            console.log("data company: ", data);
            return data.employerId;
        } catch (error) {
            console.error("Error fetching candidates:", error);
            return null;
        }
    };
    const fetchCandidates = async (employerId) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://application-service-otwul2bnna-uc.a.run.app/application/by-employer/${employerId}`,
                {
                    headers: {
                        Authorization: currentUser?.accessToken,
                    },
                },
            );
            const data = await response.json();
            //const data = exCandidates;
            console.log("data candidate: ", data);
            setCandidates(data);
            const exJobOptions = [];
            const jobIdSet = new Set();

            data.forEach((job) => {
                const { jobId, jobTitle } = job.jobInfo;
                if (!jobIdSet.has(jobId)) {
                    jobIdSet.add(jobId);
                    exJobOptions.push({ jobId, jobTitle });
                }
            });
            console.log("exJobOptions: ", exJobOptions);
            setJobOptions(exJobOptions);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const getEmployerIdAndFetchCandidates = async () => {
            const employerId = await fetchCompanyData();
            if (employerId) {
                fetchCandidates(employerId);
            }
        };
        getEmployerIdAndFetchCandidates();
    }, []);

    useEffect(() => {
        const renderResult = (data) => {
            const startIdx = (currentPage - 1) * candidatesPerPage;
            const endIdx = startIdx + candidatesPerPage;
            setResults(data.slice(startIdx, endIdx));
            setTotalPages(Math.ceil(data.length / candidatesPerPage));
        };
        console.log("check: ", filterResults.length === 0);
        if (
            filterResults.length === 0 &&
            searchQuery === "" &&
            selectedJob === "" &&
            selectedStatus === ""
        ) {
            console.log("render candidate");
            renderResult(candidates);
        } else {
            console.log("render filter result");
            renderResult(filterResults);
        }
    }, [currentPage, filterResults, candidates]);

    useEffect(() => {
        console.log("[selectedJob, selectedStatus]");
        handleSearch();
    }, [selectedJob, selectedStatus]);

    const removeVietnameseTones = (str) => {
        str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        str = str.replace(/đ/g, "d").replace(/Đ/g, "D");
        return str;
    };
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            console.log(
                "searchQuery: ",
                searchQuery,
                "\n- selectedStatus: ",
                selectedStatus,
                "- selectedJob: ",
                selectedJob,
            );
            const lowerCaseSearchQuery = removeVietnameseTones(
                searchQuery.toLowerCase(),
            );

            const filteredCandidates = candidates.filter((candidate) => {
                const {
                    applicationName,
                    jobInfo,
                    contactInfo,
                    applicationStatus,
                    jobSeekerId,
                } = candidate;

                const normalizedApplicationName = removeVietnameseTones(
                    applicationName.toLowerCase(),
                );
                const normalizedJobTitle = removeVietnameseTones(
                    jobInfo.jobTitle.toLowerCase(),
                );
                const normalizedJobId = removeVietnameseTones(
                    jobInfo.jobId.toLowerCase(),
                );
                const normalizedEmail = removeVietnameseTones(
                    contactInfo.email.toLowerCase(),
                );
                const normalizedApplicationStatus = removeVietnameseTones(
                    applicationStatus.toLowerCase(),
                );
                const normalizedJobSeekerId = removeVietnameseTones(
                    jobSeekerId.toLowerCase(),
                );

                const matchesSearchQuery =
                    lowerCaseSearchQuery === ""
                        ? true
                        : normalizedApplicationName.includes(
                              lowerCaseSearchQuery,
                          ) ||
                          normalizedJobTitle.includes(lowerCaseSearchQuery) ||
                          normalizedJobId.includes(lowerCaseSearchQuery) ||
                          normalizedEmail.includes(lowerCaseSearchQuery) ||
                          normalizedApplicationStatus.includes(
                              lowerCaseSearchQuery,
                          ) ||
                          normalizedJobSeekerId.includes(lowerCaseSearchQuery);

                const matchesStatus =
                    selectedStatus === "" ||
                    applicationStatus === selectedStatus;
                const matchesJob =
                    selectedJob === "" || jobInfo.jobId === selectedJob;

                return matchesSearchQuery && matchesStatus && matchesJob;
            });
            setFilterResults(filteredCandidates);
            setCurrentPage(1);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleJobChange = (e) => {
        setSelectedJob(e.target.value);
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    return (
        <div className="mb-[60px] bg-white p-4">
            <h2 className="text-lg font-bold">CV Management</h2>
            <br />
            <div className="mb-4 flex items-center justify-between">
                <div className="w-1/2">
                    <p>Search: </p>
                    <div className="my-2 flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Search by name, email,..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full rounded border px-2 py-1 text-sm"
                        />
                        <Search
                            className={`h-7 w-7 cursor-pointer text-gray-700 `}
                            onClick={handleSearch}
                        />
                    </div>
                </div>
                <div className="flex w-2/5 space-x-2">
                    <div className="w-1/2">
                        <p>Status: </p>
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="my-2 w-full rounded border px-2 py-1 text-sm"
                        >
                            <option value="">All</option>
                            {Object.entries(statusOptions).map(
                                ([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>
                    <div className="w-1/2">
                        <p>Job: </p>
                        <select
                            value={selectedJob}
                            onChange={handleJobChange}
                            className="my-2 w-full rounded border px-2 py-1 text-sm"
                        >
                            <option value="">All</option>
                            {jobOptions.map((job) => (
                                <option
                                    key={job.jobId}
                                    value={job.jobId}
                                    title={job.jobTitle}
                                >
                                    {truncateText(job.jobTitle, 50)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

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
                <div className="min-h-[30rem] overflow-auto">
                    <table className="min-w-full rounded border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-1/5 p-2 text-left">
                                    Applicant
                                </th>
                                <th className="w-2/5 p-2 text-left">Job</th>
                                <th className="w-1/5 p-2 text-left">
                                    Information
                                </th>
                                <th className="w-1/5 p-2 text-left">
                                    Apply At
                                </th>
                                <th className="w-1/5 p-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length > 0 ? (
                                results.map((candidate, index) => (
                                    <CandidateItem
                                        key={index}
                                        candidate={candidate}
                                        statusOptions={statusOptions}
                                        onCVViewer={onCVViewer}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-2 text-center">
                                        Have no result.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {results.length > 0 && (
                        <div className="mt-4 flex items-center justify-between">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="flex items-center rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                                <span className="ml-2">Previous</span>
                            </button>
                            <span className="text-sm text-gray-700">
                                Page{" "}
                                <strong>
                                    {currentPage} of {totalPages}
                                </strong>
                            </span>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="flex items-center rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                            >
                                <span className="mr-2">Next</span>
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

Candidates.propTypes = {
    onCVViewer: PropTypes.func,
};

export default Candidates;
