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
    FaGoogle,
    FaLink,
    FaUserFriends,
} from "react-icons/fa";

import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { ClipLoader, MoonLoader } from "react-spinners"; // Import the ClipLoader
import { db } from "../../firebase/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
} from "firebase/firestore";

const capitalized = (letter) => {
    return letter?.charAt(0).toUpperCase() + letter?.slice(1);
};

const defaultAvt =
    "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState(null);
    const [filterInput, setFilterInput] = useState("");

    const [enabling, setEnabling] = useState(false);
    const [disabling, setDisabling] = useState(false);

    const data = useMemo(() => users, [users]);

    const getUsers = async () => {
        try {
            // Create a reference to the "users" collection
            const usersRef = collection(db, "users");

            // Create a query against the collection where the role is either "user" or "employer"
            const q = query(
                usersRef,
                where("role", "in", ["user", "employer"]),
            );

            // Execute the query
            const querySnapshot = await getDocs(q);

            // Extract the data from the query snapshot
            const usersList = [];
            querySnapshot.forEach((doc) => {
                usersList.push({ id: doc.id, ...doc.data() });
            });

            // Set the state with the list of users
            setUsers(usersList);
        } catch (error) {
            console.error("Error getting users: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "Providers",
                Cell: ({ row }) => (
                    <div className="flex items-center justify-center space-x-2">
                        {row.original.googleAuth ? (
                            <FcGoogle className="h-5 w-5  text-gray-500" />
                        ) : (
                            <FaEnvelope className="h-5 w-5 text-gray-500" />
                        )}
                    </div>
                ),
            },
            {
                Header: "Avatar",
                Cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <div className="overflow-hidden rounded-full border-2 border-white">
                            <img
                                src={
                                    row.original.photoURL
                                        ? row.original.photoURL
                                        : defaultAvt
                                }
                                alt="Avatar"
                                className="h-8 w-8"
                            />
                        </div>
                    </div>
                ),
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "User Name",
                accessor: "displayName",
                Filter: ColumnFilter,
            },
            {
                Header: "Role",
                accessor: "role",
            },
            {
                Header: "Status",
                accessor: "state",
                Filter: SelectColumnFilter,
            },
            {
                Header: "Action",
                Cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <EyeIcon
                            className="h-5 w-5 cursor-pointer text-blue-500"
                            onClick={() => setSelectedUser(row.original)}
                        />
                    </div>
                ),
            },
        ],
        [],
    );

    const handleEnable = async (id) => {
        if (window.confirm("Are you sure you want to enable this account ?")) {
            setEnabling(true);
            try {
                // Create a reference to the document
                const userRef = doc(db, "users", id);

                // Update the status field
                await updateDoc(userRef, { state: "enable" });
                toast.success("Enable account user successfully ! ");
                setSelectedUser(null);
                // Call getUsers again to update the list after approval
                getUsers();
            } catch (error) {
                toast.error("Error enabling user: ", error);
            } finally {
                setEnabling(false);
            }
        } else {
            return;
        }
    };

    const handleDisable = async (id) => {
        if (window.confirm("Are you sure you want to disable this account?")) {
            setDisabling(true);
            try {
                // Create a reference to the document
                const userRef = doc(db, "users", id);

                // Update the status field
                await updateDoc(userRef, { state: "disable" });
                toast.success("Disable account user successfully ! ");
                setSelectedUser(null);
                // Call getUsers again to update the list after approval
                getUsers();
            } catch (error) {
                toast.error("Error disabling user: ", error);
            } finally {
                setDisabling(false);
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
                    Users Management
                </h3>
            </div>
            <div className="mb-4 flex space-x-4">
                <input
                    value={filterInput}
                    onChange={handleFilterChange}
                    placeholder={"Search by Name User"}
                    className="w-full rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    onChange={(e) => setFilter("role", e.target.value)}
                    className="w-full rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Role</option>
                    <option value="user">User</option>
                    <option value="employer">Employer</option>
                </select>
                <select
                    onChange={(e) => setFilter("state", e.target.value)}
                    className="w-full rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Statuses</option>
                    <option value="enable">Enable</option>
                    <option value="disable">Disable</option>
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
                                                className={`break-all px-6 py-4 text-sm font-semibold text-gray-500 ${cell.value == "enable" ? "text-green-600" : cell.value == "disable" ? "text-red-600" : "text-gray-500"}`}
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
            {selectedUser && (
                <Modal onClose={() => setSelectedUser(null)}>
                    <div className="transform rounded-lg  p-4 transition-all sm:w-full sm:max-w-lg">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                                User Details
                            </h3>
                        </div>
                        <div className="mt-4">
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaUser className="mr-2 text-gray-600" />
                                <strong>User Name:</strong>
                                <span className="ml-2">
                                    {capitalized(selectedUser?.displayName)}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaEnvelope className="mr-2 text-gray-600" />
                                <strong>User Email:</strong>
                                <span className="ml-2">
                                    {selectedUser?.email}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaPhoneAlt className="mr-2 text-gray-600" />
                                <strong>Personal Phone Number:</strong>
                                <span className="ml-2">
                                    {selectedUser.phone
                                        ? selectedUser.phone
                                        : null}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaUser className="mr-2 text-gray-600" />
                                <strong>Gender:</strong>
                                <span className="ml-2">
                                    {selectedUser.gender
                                        ? capitalized(selectedUser.gender)
                                        : null}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaLocationArrow className="mr-2 text-gray-600" />
                                <strong>Address:</strong>
                                <span className="ml-2">
                                    {selectedUser.address
                                        ? capitalized(selectedUser.address)
                                        : null}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaCalendarAlt className="mr-2 text-gray-600" />
                                <strong>Birthday:</strong>
                                <span className="ml-2">
                                    {selectedUser.birthday
                                        ? selectedUser.birthday
                                        : null}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaLink className="mr-2 text-gray-600" />
                                <strong>Personal Link:</strong>
                                <span className="ml-2">
                                    {selectedUser.personalLink
                                        ? selectedUser.personalLink
                                        : null}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaUserFriends className="mr-2 text-gray-600" />
                                <strong>Role:</strong>
                                <span className="ml-2">
                                    {capitalized(selectedUser?.role)}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center text-sm text-gray-700">
                                <FaCheck className="mr-2 text-gray-600" />
                                <strong>Status:</strong>
                                <span
                                    className={`ml-2 ${selectedUser?.state === "enable" ? "text-green-600" : "text-red-600"}`}
                                >
                                    {capitalized(selectedUser?.state)}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 ">
                            {selectedUser?.googleAuth ? (
                                <div className="flex justify-end ">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-white transition duration-150 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : selectedUser?.state === "enable" ? (
                                <div className="flex justify-end space-x-4">
                                    <div className="flex justify-end ">
                                        <button
                                            onClick={() =>
                                                setSelectedUser(null)
                                            }
                                            className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-white transition duration-150 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDisable(selectedUser?.id)
                                        }
                                        disabled={disabling}
                                        className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-white transition duration-150 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                                    >
                                        <FaTimes className="mr-2" />
                                        {disabling ? "Disabling..." : "Disable"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-end space-x-4">
                                    <div className="flex justify-end ">
                                        <button
                                            onClick={() =>
                                                setSelectedUser(null)
                                            }
                                            className="flex items-center justify-center rounded-lg bg-slate-700 px-4 py-2 text-white transition duration-150 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleEnable(selectedUser?.id)
                                        }
                                        disabled={enabling}
                                        className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-white transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                                    >
                                        <FaTimes className="mr-2" />
                                        {enabling ? "Enabling..." : "Enable"}
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

export default UserManagement;
