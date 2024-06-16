import EmployeeJobNavbar from "./employee-job-navbar";
import JobDetail from "../Search/job-detail";
import JobCard from "../ui/job-card";
import EmployeeViewJobCard from "./employee-view-jobcard";

import { db } from "@/firebase/firebase";
import { setDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";


const images ={ jobImage:'https://itviec.com/assets/everything-empty-62c813bcb84be8a092033e40550b6fdc9f6bda05947d60c619b2a74906144f8b.svg' };


const EmployeeJobSave = () => {
    const { currentUser, inSingUpInPage, isGoogleUser } = useAuth();
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

    const isRender = (profileUser) => {
      const { jobSaved } = profileUser;
  
      if (jobSaved.length === 0) {
          return false;
      }
  
      const hasSavedJobs = jobSaved.some(job => job.isSaved === true);
      return hasSavedJobs;
  };
  

    return (
      <div className=" min-h-screen bg-gray-200 w-full">
        <div className="bg-gray-200 w-full">
          <div className="mt-10 mr-32 ml-32 flex justify-between">
            <div><p className="text-2xl font-semibold">Save Job</p></div>
            <div>
              <p>Sort by</p>
              <div></div>
            </div>
          </div>

          <div className="bg-white mt-10 mr-32 ml-32">
              <div className="">
                  {profileUser.jobSaved && isRender(profileUser) ? (
                          <EmployeeViewJobCard jobs={profileUser.jobSaved} location="job-saved"/>
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
  
export default EmployeeJobSave;