import React from 'react';
import { useState } from 'react';
import EmployerProfile from './employer-profile';
import JobPost from './job-post';

const tabs = [
  { name: 'Employer\'s profile' },
  { name: 'Add a job' },
]

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`flex-grow px-4 py-2 border-b-2 ${activeTab === tab.name ? 'border-black' : ''
              }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {activeTab === 'Employer\'s profile' && <EmployerProfile />}
      {activeTab === 'Add a job' && <JobPost />}
    </div>
  );
};

export default Dashboard;
