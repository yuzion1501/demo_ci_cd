import EmployeeJobNavbar from "./employee-job-navbar";
import Container from "@/components/layout/container";

import { db } from "@/firebase/firebase";
import { setDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";

import EmployeeJobSave from "./employee-job-save";

const StoreRecentViewedJob = async (job, currentUser) => {
    try {
        const docRef = doc(db, "employeeJobInfo", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const profileData = docSnap.data();
            console.log(profileData)
            const jobRecentView = profileData.jobRecentView || [];

            // Check if the job is already in the jobRecentView array
            const jobExists = jobRecentView.some(
                (viewedJob) => viewedJob.id === job.id,
            );

            if (!jobExists) {
                // Append the new job to the existing array
                await updateDoc(docRef, {
                    jobRecentView: arrayUnion(job),
                });
            } else {
                // console.log("Job is already in the recent view list");
            }
        } else {
            // If the document does not exist, create it with the new job
            await setDoc(docRef, {
                jobRecentView: [job],
            });
        }

        toast.success("Job viewed has saved successfully!");
    } catch (error) {
        console.log(error)
    }
};

const StoreSavedJob = async (job, currentUser, isSaved) => {
    try {
        const docRef = doc(db, "employeeJobInfo", currentUser.uid);
        const docSnap = await getDoc(docRef);
        const savedJob = { ...job, isSaved };

        if (docSnap.exists()) {
            const profileData = docSnap.data();
            let jobSaved = profileData.jobSaved || [];

            // Check if the job is already in the jobSaved array
            const jobIndex = jobSaved.findIndex((saved) => saved.id === job.id);

            if (jobIndex !== -1) {
                // Update the existing job in the array
                jobSaved[jobIndex] = savedJob;
                await updateDoc(docRef, {
                    jobSaved: jobSaved,
                });
                toast.success("Saved job is updated successfully!");
            } else {
                // Append the new job to the existing array
                await updateDoc(docRef, {
                    jobSaved: [...jobSaved, savedJob],
                });
                toast.success("Job saved successfully!");
            }
        } else {
            // If the document does not exist, create it with the new job
            await setDoc(docRef, {
                jobSaved: [savedJob],
            });
            toast.success("Job saved successfully!");
        }
    } catch (error) {
        toast.error("Error saving job:", error);
    }
};

const StoreAppliedJob = async (jobID, currentUser) => {
    try {
        const docRef = doc(db, "employeeJobInfo", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const profileData = docSnap.data();
            const jobApply = profileData.jobApplied || [];

            // Check if the job is already in the jobRecentView array
            const jobExists = jobApply.some(
                (jobApplied) => jobApplied === jobID,
            );

            if (!jobExists) {
                // Append the new job to the existing array
                await updateDoc(docRef, {
                    jobApplied: arrayUnion(jobID),
                });
            } else {
                console.log("Job is already in the applied view list");
            }
        } else {
            // If the document does not exist, create it with the new job
            await setDoc(docRef, {
                jobApplied: [jobID],
            });
        }

        toast.success("Stored Job applied successfully!");
    } catch (error) {
        toast.error("Error updating StoreRecentViewedJob:", error);
    }
};

const CheckIsSavedJob = async (job, currentUser) => {
    try {
        if (currentUser) {
            const profileDoc = await getDoc(
                doc(db, "employeeJobInfo", currentUser.uid),
            );
            
            const profileData = profileDoc.exists() ? profileDoc.data() : {};
            const jobSaved = Array.isArray(profileData.jobSaved) ? profileData.jobSaved : [];
            const targetJob = jobSaved.find(
                (jobSaving) => jobSaving.id === job.id,
            );
            return targetJob ? targetJob.isSaved : false;
        }
        return false;
    } catch (error) {
        console.error("Error checking saved job:", error);
        return false
    }
};

const EmployeeJobManagement = () => {
    // const { currentUser, inSingUpInPage, isGoogleUser } = useAuth();

    // const [profileUser, setProfileUser] = useState("null");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, "employeeJobInfo", currentUser.uid), {
                jobRecentView: null,
            });

            toast.success("Update Company test successfully ");
        } catch (error) {
            toast.error("Error update user AboutMe :", error);
        }
    };

    return (
        <>
            <div className=" min-h-screen w-full bg-gray-200">
                <EmployeeJobNavbar />
                {/* <p className="text-2xl">{console.log(profileUser)}</p> */}

                <EmployeeJobSave />
            </div>
        </>
    );
};

export default EmployeeJobManagement;
export { StoreRecentViewedJob, StoreSavedJob, StoreAppliedJob,  CheckIsSavedJob };
