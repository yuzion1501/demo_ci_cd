import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from "../../contexts/authContext";
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronLeft } from 'lucide-react';
import {PropTypes} from 'prop-types'
const statusOptions = {
  'in_review': 'CV received' ,
  'accepted': 'Accepted',
  'rejected': 'Rejected'
};

const CVViewer = ({onTabChange, applicationDto}) => {
  //const {applicationId} = useParams();
  const [applicationData, setApplicationData] = useState(applicationDto);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  console.log("applicationDto: ", applicationData);
  console.log("currentUser: ", currentUser);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(applicationData?.jobSeekerId);
    toast.success("Copy successfully!")
  };
  
  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = applicationData.cvLink;
    link.target = "_blank";
    link.download = applicationData.cvLink.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateApplicationStatus = async (newStatus) => {
    setIsLoading(true);
    if (!applicationData) return;
    try {
      const response = await fetch(`https://application-service-otwul2bnna-uc.a.run.app/application/${newStatus}/${applicationData.applicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: currentUser?.accessToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      
      setApplicationData((prevData) => ({
        ...prevData,
        applicationStatus: newStatus + "ed",
      }));
      toast.success(`CV status has been updated to "${newStatus}"`);
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast.error("Error! Can not update status.");
    }finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <ClipLoader
            color="rgba(239, 68, 68, 1)"
            size={40}
            speedMultiplier={1}
            className="mt-4 "
        />
    </div>;
  }

  if (!applicationData) {
    return <div className="flex justify-center items-center h-screen">No candidate data available.</div>;
  }
  
  return (
    <>
    <div className="h-[40px] ">
        <button onClick={() => onTabChange('cv-management')} className="flex items-center rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50">
          <ChevronLeft className="h-5 w-5" />
          <span className="ml-2">Back</span>
        </button>
    </div>
    <div className="flex p-4 h-screen">
      {/* Left Section for PDF Content */}
      <div className="w-2/3 bg-gray-100 p-4 border-r">
        <iframe 
          src={applicationData.cvLink}
          title="CV PDF Viewer"
          className="w-full h-full"
        />
      </div>

      {/* Right Section for CV Details and Actions */}
      <div className="w-1/3 p-4">
        <div className="bg-white shadow-lg p-4">
          <div className="items-center mb-4">
              <div className="font-bold">{applicationData?.applicationName}</div>
              <div className="text-sm text-gray-600">{applicationData?.contactInfo.email} </div>
            
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">Change CV status : </div>
            <div className="flex items-center justify-between">
              <button 
                disabled={applicationData.applicationStatus === 'accepted'} 
                onClick={() => updateApplicationStatus('accept')} 
                className={`w-1/2 py-2 rounded mr-2 ${applicationData.applicationStatus === 'accepted'
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                Accept
              </button>
              <button 
                disabled={applicationData.applicationStatus === 'rejected'} 
                onClick={() => updateApplicationStatus('reject')} 
                className={`w-1/2 py-2 rounded mr-2 ${applicationData.applicationStatus === 'rejected'
                  ? 'bg-red-100 text-red-700 cursor-not-allowed' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                  Reject
              </button>
            </div>
          </div>
          <div className="mb-4 flex">
            <div className="font-semibold mb-2">CV status:</div>
            <span className="text-gray-600 ml-4">{statusOptions[applicationData.applicationStatus]}</span>
          </div>
          <div>
            
            <button onClick={downloadCV} className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full mb-2 hover:bg-blue-500 hover:text-white ">Download CV PDF</button>
            <div className="text-gray-600 my-2">Applicant ID</div>
            <div className="bg-gray-100 text-gray-800 px-4 py-2 mb-2 text-center border-gray-300 border-2 rounded overflow-hidden text-ellipsis whitespace-nowrap">{applicationData?.jobSeekerId}</div>
            <button onClick={copyCodeToClipboard} className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full mb-2 hover:bg-blue-500 hover:text-white"> Copy code to clipboard </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
CVViewer.propTypes = {
  onTabChange: PropTypes.func,
  applicationDto: PropTypes.object
}

export default CVViewer;
