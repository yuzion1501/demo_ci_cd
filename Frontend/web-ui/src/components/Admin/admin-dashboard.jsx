import React, { useState } from "react";
import AdminSidebar from "./admin-sidebar";
import EmployerManagement from "./employers-management";
import UserManagement from "./users-management";
import JobManagement from "./jobs-management";
import JobDetail from "./job-detail";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [selectedJob, setSelectedJob] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedJob(null); // Reset selected job when changing tabs
    };

    const renderContent = () => {
        if (selectedJob) {
            return (
                <JobDetail
                    job={selectedJob}
                    onBack={() => setSelectedJob(null)}
                />
            );
        }
        switch (activeTab) {
            case "user-management":
                return <UserManagement />;
            case "employer-management":
                return <EmployerManagement />;
            case "job-management":
                return <JobManagement onSelectJob={setSelectedJob} />;
            default:
                return <UserManagement />;
        }
    };

    return (
        <div className="flex bg-gray-100">
            <AdminSidebar onTabChange={handleTabChange} />
            <div className=" min-h-screen w-full p-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
