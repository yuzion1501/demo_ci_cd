import EmployeeJobNavbar from "./employee-job-navbar";
import JobDetail from "../Search/job-detail";
import JobCard from "../ui/job-card";
import EmployeeViewJobCard from "./employee-view-jobcard";
import EmployeeViewAppliedJob from "./employee-view-applied-job";

import { db } from "@/firebase/firebase";
import { setDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";


const images ={ jobImage:'https://itviec.com/assets/everything-empty-62c813bcb84be8a092033e40550b6fdc9f6bda05947d60c619b2a74906144f8b.svg' };


const EmployeeJobApplied = () => {
    const { currentUser, inSingUpInPage, isGoogleUser } = useAuth();
    const [jobAppliedRender, setJobAppliedRender] = useState([]);
    const [profileUser, setProfileUser] = useState("null");
    
    useEffect(() => {
      const fetchUserData = async () => {
          if (currentUser) {
              const profileDoc = await getDoc(
                  doc(db, "employeeJobInfo", currentUser.uid),
              );
              const profileData = profileDoc.exists()
                  ? profileDoc.data()
                  : {};
              setProfileUser(profileData);
          }
      };
  
      fetchUserData();
    }, []);

    useEffect(() => {
      const fetchJobData = async (jobId) => {
          try {
              const response = await fetch(`https://job-search-service.azurewebsites.net/job-elastic/job-by-id/${jobId}`);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data = await response.json();
              return data;
          } catch (error) {
              console.error('Error fetching JobData:', error);
              return null;
          }
      };

      const fetchAllJobs = async () => {
            console.log(profileUser.jobApplied)
          if (profileUser.jobApplied && profileUser.jobApplied.length > 0) {
              try {
                  const jobDataPromises = profileUser.jobApplied.map(jobId => fetchJobData(jobId));
                  const jobDataArray = await Promise.all(jobDataPromises);
                  const validJobDataArray = jobDataArray.filter(job => job !== null);
                  setJobAppliedRender(validJobDataArray);
                  console.log(validJobDataArray)
                  toast.success("Successfully fetched job data!");
              } catch (error) {
                  toast.error("Error fetching job data");
              }
          }
      };

      fetchAllJobs();
  }, [profileUser]);

    return (
      <div className=" min-h-screen bg-gray-200 w-full">
        <EmployeeJobNavbar />
        <div className="bg-gray-200 w-full">
          <div className="mt-10 mr-32 ml-32 flex justify-between">
            <div><p className="text-2xl font-semibold">Applied Job</p></div>
            <div>
              <p>Sort by</p>
              <div></div>
            </div>
          </div>

          <div className="bg-white mt-10 mr-32 ml-32">
              <div className="">

                  {profileUser && profileUser.jobApplied && profileUser.jobApplied.length != 0 ? (
                          <EmployeeViewAppliedJob jobs={jobAppliedRender} />
                  ) : (
                    <div className="flex flex-col h-72 justify-center">
                    <div className="self-center"><img src={images.jobImage} alt="JOB Folder" /></div>
                    <div className="self-center"><p className="text-gray-500">You have 0 jobs</p></div>
                    </div>
                  )}
              </div>
          </div>
        </div>    
      </div>
    );
};
  

export default EmployeeJobApplied;



