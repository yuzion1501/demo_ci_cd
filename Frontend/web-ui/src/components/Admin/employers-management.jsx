import React, { useState, useMemo, useEffect } from "react";
import Container from "@/components/layout/container";
import { useTable, usePagination, useSortBy, useFilters } from "react-table";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
} from "@heroicons/react/solid";
import Modal from "./modal";
import {
    FaCheck,
    FaTimes,
    FaBuilding,
    FaUser,
    FaEnvelope,
    FaCalendarAlt,
    FaPhoneAlt,
    FaLocationArrow,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // Import the ClipLoader
import { db } from "../../firebase/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";

const capitalized = (letter) => {
    return letter?.charAt(0).toUpperCase() + letter?.slice(1);
};

const EmployerManagement = () => {

    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [filterInput, setFilterInput] = useState("");

    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const data = useMemo(() => employers, [employers]);

    const getEmployers = async () => {
        try {
            // Create a reference to the "users" collection
            const usersRef = collection(db, "users");

            // Create a query against the collection where the role is "employer"
            const q = query(usersRef, where("role", "==", "employer"));

            // Execute the query
            const querySnapshot = await getDocs(q);

            // Extract the data from the query snapshot
            const employersList = [];
            querySnapshot.forEach((doc) => {
                employersList.push({ id: doc.id, ...doc.data() });
            });
            // Set the state with the list of employers
            setEmployers(employersList);
        } catch (error) {
            console.error("Error getting employers: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getEmployers();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "Company Name",
                accessor: "company",
            },
            {
                Header: "Employer Name",
                accessor: "displayName",
                Filter: ColumnFilter,
            },
            {
                Header: "Registration Date",
                accessor: "registrationDate",
            },
            {
                Header: "Status",
                accessor: "status",
                Filter: SelectColumnFilter,
            },
            {
                Header: "Action",
                Cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <EyeIcon
                            className="h-5 w-5 cursor-pointer text-blue-500"
                            onClick={() => setSelectedEmployer(row.original)}
                        />
                    </div>
                ),
            },
        ],
        [],
    );

    const handleApprove = async (id) => {
        if (window.confirm("Are you sure you want to approve?")) {
            setApproving(true);
            try {
                // Create a reference to the document
                const employerRef = doc(db, "users", id);
                // Get company name & worklocation
                const userDoc = await getDoc(doc(db, "users", id));
                const userData = userDoc.exists() ? userDoc.data() : {};

                // WorkLocation & companyName
                // userData.workLocation & userData.company

                // Update the status field
                await updateDoc(employerRef, { status: "approved" });

                toast.success("Approve account employer successfully ! ");
                setSelectedEmployer(null);
                // Call getEmployers again to update the list after approval
                getEmployers();
            } catch (error) {
                toast.error("Error approving employer: ", error);
            } finally {
                setApproving(false);
            }
        } else {
            return;
        }
  };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to reject?")) {
            setRejecting(true);
            try {
                // Create a reference to the document
                const employerRef = doc(db, "users", id);
                // Update the status field
                await updateDoc(employerRef, { status: "rejected" });
                toast.success("Reject account employer successfully ! ");
                setSelectedEmployer(null);
                // Call getEmployers again to update the list after approval

                getEmployers();
            } catch (error) {
                toast.error("Error rejecting employer: ", error);
            } finally {
                setRejecting(false);
            }
        } else {
            return;
        }
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setFilter,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useFilters,
        useSortBy,
        usePagination,
    );

    const handleFilterChange = (e) => {
        const value = e.target.value || undefined;
        setFilter("displayName", value);
        setFilterInput(value);
    };

    if (loading) {
        return (
            <Container className="flex items-center justify-center py-16 pt-8">
                <ClipLoader size={50} color={"red"} loading={loading} />
            </Container>
        );
    }

    return (
        <Container className="py-16 pt-8">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                    Employers Management
                </h3>
            </div>
            <div className="mb-4 flex space-x-4">
                <input
                    value={filterInput}
                    onChange={handleFilterChange}
                    placeholder={"Search by Name Employer"}
                    className="w-full rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    onChange={(e) => setFilter("status", e.target.value)}
                    className="w-full rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-lg"
            >
                <thead className="bg-red-600 text-white">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps(),
                                    )}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                >
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " ▼"
                                                : " ▲"
                                            : ""}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody
                    {...getTableBodyProps()}
                    className="divide-y divide-gray-200"
                >
                    {page.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-4 text-center text-sm text-gray-500"
                            >
                                No results found
                            </td>
                        </tr>
                    ) : (
                        page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className="hover:bg-gray-50"
                                >
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className={`break-all px-6 py-4 text-sm font-semibold text-gray-500 ${cell.value == "pending" ? "text-orange-600" : cell.value == "approved" ? "text-green-600" : cell.value == "rejected" ? "text-red-600" : "text-gray-500"}`}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="flex items-center rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                    <span className="ml-2">Previous</span>
                </button>
                <span className="text-sm text-gray-700">
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="flex items-center rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                >
                    <span className="mr-2">Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
            {selectedEmployer && (
                <Modal onClose={() => setSelectedEmployer(null)}>
                    <div className="transform rounded-lg  p-4 transition-all sm:w-full sm:max-w-lg">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Employer Details
                            </h3>
                        </div>
                        <div className="mt-4">
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaBuilding className="mr-2 text-gray-600" />
                                <strong>Company Name:</strong>
                                <span className="ml-2">
                                    {selectedEmployer?.company}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaUser className="mr-2 text-gray-600" />
                                <strong>Employer Name:</strong>
                                <span className="ml-2">
                                    {selectedEmployer?.displayName}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaEnvelope className="mr-2 text-gray-600" />
                                <strong>Employer Email:</strong>
                                <span className="ml-2">
                                    {selectedEmployer?.email}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaPhoneAlt className="mr-2 text-gray-600" />
                                <strong>Personal Phone Number:</strong>
                                <span className="ml-2">
                                    {selectedEmployer?.phone}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaUser className="mr-2 text-gray-600" />
                                <strong>Gender:</strong>
                                <span className="ml-2">
                                    {capitalized(selectedEmployer?.gender)}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaLocationArrow className="mr-2 text-gray-600" />
                                <strong>Work Location:</strong>
                                <span className="ml-2">
                                    {selectedEmployer?.workLocation}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaCalendarAlt className="mr-2 text-gray-600" />
                                <strong>Registration Date:</strong>
                                <span className="ml-2">
                                    {selectedEmployer?.registrationDate}
                                </span>
                            </div>

                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaCheck className="mr-2 text-gray-600" />
                                <strong>Status:</strong>
                                <span
                                    className={`ml-2 ${selectedEmployer?.status === "approved" ? "text-green-600" : selectedEmployer?.status === "rejected" ? "text-red-600" : "text-orange-600"}`}
                                >
                                    {selectedEmployer?.status}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 ">
                            {selectedEmployer?.status === "pending" ? (
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() =>
                                            handleApprove(selectedEmployer?.id)
                                        }
                                        disabled={approving}
                                        className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                    >
                                        <FaCheck className="mr-2" />{" "}
                                        {approving ? "Approving..." : "Approve"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleReject(selectedEmployer?.id)
                                        }
                                        disabled={rejecting}
                                        className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white transition duration-150 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                                    >
                                        <FaTimes className="mr-2" />{" "}
                                        {rejecting ? "Rejecting..." : "Reject"}
                                    </button>
                                </div>
                            ) : selectedEmployer?.status === "approved" ? (
                                <div className="flex justify-end ">
                                    <button
                                        onClick={() =>
                                            setSelectedEmployer(null)
                                        }
                                        className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-white transition duration-150 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() =>
                                            handleApprove(selectedEmployer?.id)
                                        }
                                        disabled={approving}
                                        className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                    >
                                        <FaCheck className="mr-2" />{" "}
                                        {approving ? "Approving..." : "Approve"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </Container>
    );
};

function ColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ""}
            onChange={(e) => setFilter(e.target.value || undefined)}
            placeholder={`Search ${count} records...`}
            className="w-full rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
}

function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    const options = useMemo(() => {
        const optionsSet = new Set();
        preFilteredRows.forEach((row) => {
            optionsSet.add(row.values[id]);
        });
        return [...optionsSet.values()];
    }, [id, preFilteredRows]);

    return (
        <select
            value={filterValue}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            className="w-full rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default EmployerManagement;
