import React from "react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { CirclePlus, ChevronDown, ChevronUp, Star } from "lucide-react";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

import PersonalInfoPopUp from "./PopupForm/personal-info-popup";
import WorkExperiencePopup from "./PopupForm/work-experience-popup";
import AboutMePopup from "./PopupForm/about-me-popup";
import EducationPopup from "./PopupForm/education-popup";
import PersonalProjectPopup from "./PopupForm/personal-project-popup";
import CertificatePopup from "./PopupForm/certificate-popup";
import AwardPopup from "./PopupForm/award-popup";
import SkillPopup from "./PopupForm/skill-popup";

import { useAuth } from "../../contexts/authContext";

const ProfileProgressBar = () => {
    const { currentUser, inSingUpInPage, isGoogleUser } = useAuth();
    const [showMore, setShowMore] = useState(false);

    const [profileUser, setProfileUser] = useState(null);
    const [isOpenPopupPersonal, setIsPopupPersonal] = useState(false);
    const [isOpenAboutMePopup, setIsOpenAboutMePopup] = useState(false);
    const [isOpenEducationMePopup, setIsOpenEducationMePopup] = useState(false);
    const [isOpenWorkExperiencePopup, setisOpenWorkExperiencePopup] =
        useState(false);

    const [isOpenPersonalProjectPopup, setIsOpenPersonalProjectPopup] =
        useState(false);
    const [isOpenCertificatePopup, setIsOpenCertificatePopup] = useState(false);
    const [isOpenAwardPopup, setIsOpenAwardPopup] = useState(false);
    const [isOpenSkillPopup, setisOpenSkillPopup] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const profileDoc = await getDoc(
                    doc(db, "profiles", currentUser.uid),
                );
                const profileData = profileDoc.exists()
                    ? profileDoc.data()
                    : {};
                setProfileUser(profileData);
            }
        };

        fetchUserData();
    }, [currentUser, isOpenAboutMePopup]);

    const handleModifyPersonalClick = () => {
        setIsPopupPersonal(true);
    };

    const handleModifyAboutMeClick = () => {
        setIsOpenAboutMePopup(true);
    };
    const handleModifyWorkExperiencelClick = () => {
        setisOpenWorkExperiencePopup(true);
    };
    const handleModifyEducationClick = () => {
        setIsOpenEducationMePopup(true);
    };
    const handleModifyPersonalProjectClick = () =>
        setIsOpenPersonalProjectPopup(true);
    const handleModifyCertificateClick = () => setIsOpenCertificatePopup(true);
    const handleModifyAwardClick = () => setIsOpenAwardPopup(true);
    const handleModifySkillClick = () => setisOpenSkillPopup(true);

    // tham khao viec danh gia strength cua profile
    // const evaluteProfileStrength = () => {
    //     const totalFields = Object.keys(userInfo).length;
    //     const nonNullFields = Object.values(userInfo).filter(value => value !== null).length;

    //     let evaluation;
    //     if (nonNullFields > 10) {
    //         evaluation = 'Excellent';
    //     } else if (nonNullFields >= 8) {
    //         evaluation = 'Good';
    //     } else if (nonNullFields >= 6) {
    //         evaluation = 'Medium';
    //     } else {
    //         evaluation = 'Poor';
    //     }
    //     const scorePercentage = (nonNullFields / totalFields) * 100;
    //     return (
    //         <div>
    //             <p className="text-xl font-bold">Profile Strength</p>
    //             <p className="text-base">{evaluation}</p>
    //             <p className="">{Math.floor(scorePercentage)}% completed</p>
    //         </div>
    //     );
    // }

    return (
        <div className="col-span-1 mt-3 ">
            <div className="h-auto w-full rounded-lg bg-white p-5">
                <div className="grid  grid-cols-3 gap-4 p-4">
                    <div className="col-span-1 flex items-center justify-center">
                        <div className="flex size-16 justify-center rounded-full border-4 border-gray-400">
                            <Star className="relative size-8 self-center fill-amber-600 stroke-amber-600" />
                        </div>
                    </div>
                    <div className="col-span-2 flex flex-col">
                        <p className="text-lg font-medium text-slate-700">
                            Profile Strength
                        </p>
                        <p className="text-lg font-semibold text-amber-500">
                            Poor
                        </p>
                        <p className="text-sm">5% completed</p>
                    </div>
                </div>
                <hr />
                <div>
                    <p className="mb-2 mt-4 text-base font-semibold text-slate-700">
                        Upgrade profile to "Excellent" to unlock Download CV
                    </p>
                    <div className="flex flex-col justify-center">
                        {!profileUser?.aboutMe && (
                            <div className="w-100 mb-0 p-2">
                                <button onClick={handleModifyAboutMeClick}>
                                    <div className="flex items-center gap-2">
                                        <CirclePlus className="h-4 w-4 text-blue-700" />
                                        <p className="text-base text-blue-700">
                                            Add About me
                                        </p>
                                    </div>
                                </button>
                            </div>
                        )}
                        <div className="w-100 mb-0 p-2">
                            <button onClick={handleModifyPersonalClick}>
                                <div className="flex items-center gap-2">
                                    <CirclePlus className="h-4 w-4 text-blue-700" />
                                    <p className="text-base text-blue-700">
                                        Add Contact Information
                                    </p>
                                </div>
                            </button>
                        </div>
                        <div className="w-100 mb-0 p-2">
                            <button onClick={handleModifyWorkExperiencelClick}>
                                <div className="flex items-center gap-2">
                                    <CirclePlus className="h-4 w-4 text-blue-700" />
                                    <p className="text-base text-blue-700">
                                        Add Work Experience
                                    </p>
                                </div>
                            </button>
                        </div>
                        {!showMore ? (
                            <></>
                        ) : (
                            <>
                                <div className="w-100 mb-0 p-2">
                                    <button
                                        onClick={handleModifyEducationClick}
                                    >
                                        <div className="flex items-center gap-2">
                                            <CirclePlus className="h-4 w-4 text-blue-700" />
                                            <p className="text-base text-blue-700">
                                                Add Education
                                            </p>
                                        </div>
                                    </button>
                                </div>
                                <div className="w-100 mb-0 p-2">
                                    <button onClick={handleModifySkillClick}>
                                        <div className="flex items-center gap-2">
                                            <CirclePlus className="h-4 w-4 text-blue-700" />
                                            <p className="text-base text-blue-700">
                                                Add Skills
                                            </p>
                                        </div>
                                    </button>
                                </div>
                                <div className="w-100 mb-0 p-2">
                                    <button
                                        onClick={handleModifyCertificateClick}
                                    >
                                        <div className="flex items-center gap-2">
                                            <CirclePlus className="h-4 w-4 text-blue-700" />
                                            <p className="text-base text-blue-700">
                                                Add Certificates
                                            </p>
                                        </div>
                                    </button>
                                </div>
                                <div className="w-100 mb-0 p-2">
                                    <button onClick={handleModifyAwardClick}>
                                        <div className="flex items-center gap-2">
                                            <CirclePlus className="h-4 w-4 text-blue-700" />
                                            <p className="text-base text-blue-700">
                                                Add Awards
                                            </p>
                                        </div>
                                    </button>
                                </div>
                                <div className="w-100 mb-0 p-2">
                                    <button
                                        onClick={
                                            handleModifyPersonalProjectClick
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <CirclePlus className="h-4 w-4 text-blue-700" />
                                            <p className="text-base text-blue-700">
                                                Add Personal Projects
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                        <div className="w-100 mb-0 p-2">
                            <button
                                onClick={() =>
                                    setShowMore((prevShow) => !prevShow)
                                }
                            >
                                <div className="flex items-center gap-2">
                                    {!showMore ? (
                                        <ChevronDown className="h-6 w-6 text-gray-700" />
                                    ) : (
                                        <ChevronUp className="h-6 w-6 text-gray-700" />
                                    )}
                                    <p className="text-base text-gray-700">
                                        {!showMore
                                            ? "Add more information"
                                            : "Show less"}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="">
                    <div className="my-4 flex h-3/5 flex-row justify-between gap-1">
                        <div className="w-1/4">
                            <img
                                src="https://itviec.com/assets/profile/cv-d4db00ef4c885c25e437715236babd64c7cbb960ddf4771e69e55dd8169dd5ba.svg"
                                alt="CV image"
                            />
                        </div>
                        <p className="w-3/4">
                            Explore CV templates and download your CV
                        </p>
                    </div>
                    <div className="h-2/5">
                        <div className="flex justify-center">
                            <Button className="w-full">
                                Preview and Download CV
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {isOpenPopupPersonal && (
                <PersonalInfoPopUp
                    userInfo={currentUser}
                    onClose={() => setIsPopupPersonal(false)}
                />
            )}
            {isOpenWorkExperiencePopup && (
                <WorkExperiencePopup
                    userInfo={currentUser}
                    onClose={() => setisOpenWorkExperiencePopup(false)}
                />
            )}
            {isOpenAboutMePopup && (
                <AboutMePopup
                    userInfo={currentUser}
                    aboutMe={profileUser?.aboutMe}
                    onClose={() => setIsOpenAboutMePopup(false)}
                />
            )}
            {isOpenEducationMePopup && (
                <EducationPopup
                    userInfo={currentUser}
                    onClose={() => setIsOpenEducationMePopup(false)}
                />
            )}
            {isOpenPersonalProjectPopup && (
                <PersonalProjectPopup
                    userInfo={currentUser}
                    onClose={() => setIsOpenPersonalProjectPopup(false)}
                />
            )}
            {isOpenCertificatePopup && (
                <CertificatePopup
                    userInfo={currentUser}
                    onClose={() => setIsOpenCertificatePopup(false)}
                />
            )}
            {isOpenAwardPopup && (
                <AwardPopup
                    userInfo={currentUser}
                    onClose={() => setIsOpenAwardPopup(false)}
                />
            )}
            {isOpenSkillPopup && (
                <SkillPopup
                    userInfo={currentUser}
                    onClose={() => setisOpenSkillPopup(false)}
                />
            )}
        </div>
    );
};

export default ProfileProgressBar;
