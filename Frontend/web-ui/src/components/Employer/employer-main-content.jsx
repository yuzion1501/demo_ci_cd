import PropTypes from 'prop-types';
import Dashboard from './dashboard';
import Candidates from './candidate';
import JobList from './job-list';
import CVViewer from './cv-detail';


const EmployerMainContent = ({activeTab, onTabChange, onCVViewer, applicationData}) => {
  return (
    <div className="w-4/5 bg-gray-100 p-4">
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'job-management' && <JobList />}
      {activeTab === 'cv-management' && <Candidates onCVViewer={onCVViewer} />}
      {activeTab === 'cv-viewer' && <CVViewer onTabChange={onTabChange} applicationDto={applicationData}/>}
      
    </div>
  );
};
EmployerMainContent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func,
  onCVViewer: PropTypes.func,
  applicationData: PropTypes.object,
};
export default EmployerMainContent;
