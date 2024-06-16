import  {useState } from 'react';
import EmployerSidebar from './employer-sidebar';
import EmployerMainContent from './employer-main-content';

const EmployerContainer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applicationData, setApplicationData] = useState(null);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleCVViewer = (applicationData) => {
    console.log("-- set application data : ", applicationData);
    setApplicationData(applicationData);
    handleTabChange('cv-viewer');
  };
  return (
    <div className="flex  bg-slate-500">
      <EmployerSidebar onTabChange={handleTabChange} />
      <EmployerMainContent 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onCVViewer={handleCVViewer} 
        applicationData={applicationData}/>
      
    </div>
  );
};

export default EmployerContainer;
