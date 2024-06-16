import { useState } from "react";
import { User, Briefcase, LayoutDashboard } from "lucide-react";

import { useAuth } from "@/contexts/authContext";

const defaultAvt =
        "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png";

const AdminSidebar = ({ onTabChange }) => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("user-management");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        onTabChange(tab); // Notify parent component of tab change
    };

    const getTabClassName = (tab) =>
        `flex items-center cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
            activeTab === tab
                ? "text-red-500 bg-red-100"
                : "text-gray-900 hover:bg-gray-200"
        }`;

    return (
        <div className="min-h-screen w-[25%] bg-gray-100 p-6 text-gray-900 shadow-lg">
            <div className="mb-8 flex items-center">
                <img
                    src={currentUser?.photoURL ? currentUser.photoURL : defaultAvt}
                    alt="Avatar"
                    className="mr-3 h-12 w-12 rounded-full border-2 border-gray-300"
                />
                <div>
                    <p className="text-base font-semibold">
                        {currentUser?.displayName}
                    </p>
                    <p className="text-sm text-gray-500">
                        {currentUser?.email}
                    </p>
                </div>
            </div>
            <ul className="space-y-3">
                <li
                    className={getTabClassName("user-management")}
                    onClick={() => handleTabChange("user-management")}
                >
                    <User className="mr-4 h-5 w-5" />
                    <span className="flex-grow">Users Management</span>
                </li>
                <li
                    className={getTabClassName("employer-management")}
                    onClick={() => handleTabChange("employer-management")}
                >
                    <User className="mr-4 h-5 w-5" />
                    <span className="flex-grow">Employers Management</span>
                </li>
                <li
                    className={getTabClassName("job-management")}
                    onClick={() => handleTabChange("job-management")}
                >
                    <Briefcase className="mr-4 h-5 w-5" />
                    <span className="flex-grow">Job Posts Management</span>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
