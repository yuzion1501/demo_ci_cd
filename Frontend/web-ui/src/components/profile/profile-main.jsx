import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";

import { useAuth } from "../../contexts/authContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
    Mail,
    Gift,
    MapPin,
    Phone,
    User,
    Globe,
    SquarePen,
    CirclePlus,
    ChevronDown,
} from "lucide-react";
import ProfileContent from "./profile-content";
import PersonalInfoPopUp from "./PopupForm/personal-info-popup";
import WorkExperiencePopup from "./PopupForm/work-experience-popup";
import AboutMePopup from "./PopupForm/about-me-popup";
import EducationPopup from "./PopupForm/education-popup";
import PersonalProjectPopup from "./PopupForm/personal-project-popup";
import CertificatePopup from "./PopupForm/certificate-popup";
import AwardPopup from "./PopupForm/award-popup";
import SkillPopup from "./PopupForm/skill-popup";
import { toast } from "react-toastify";

const images = {
    aboutImage:
        "https://itviec.com/assets/profile/about_me_no_info-c7c9aa8f95cc149ec7646e171c59c2d261d0c9d62da0f5b1fff75886691bd8e9.svg",
    educationImage:
        "https://itviec.com/assets/profile/education_no_info-73d159c5c97d90ff0cdd22764fdde92a6ecefaa39c1f68775ba3e126e8ee6140.svg",
    workImage:
        "https://itviec.com/assets/profile/experience_no_info-c25e08f6ba4db4a16e0b948d42a90451c7895790324da6420ffeba9525c9c6eb.svg",
    skillImage:
        "https://itviec.com/assets/profile/skill_no_info-02f56fa0a5b0ab2ae7d233ceac098f1102a4f774de22f70b0c81fd8e1fb9efbf.svg",
    projectImage:
        "https://itviec.com/assets/profile/project_no_info-393d7f7ad578814bcce189f5681ba7e90f6a33343cdb0172eb9761ece4094b5d.svg",
    certificateImage:
        "https://itviec.com/assets/profile/certificate_no_info-26fedfa95c272adfe65f1136c3c04973002bea978cc21f91d04f7ce81caeda3f.svg",
    awardsImage:
        "https://itviec.com/assets/profile/award_no_info-0a31e0f6a55c3e2b6131000b7c09eab0182d74ab3f6461d604ba495d1cd42571.svg",
};

const defaultAvt =
    "https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png";

const capitalized = (letter) => {
    return letter.charAt(0).toUpperCase() + letter.slice(1);
};

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
};

const ProfileMain = () => {
    const { currentUser, inSingUpInPage, isGoogleUser } = useAuth();

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
    const [loading, setLoading] = useState(true); // Trạng thái loading

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            if (currentUser) {
                try {
                    const profileDoc = await getDoc(
                        doc(db, "profiles", currentUser.uid),
                    );
                    const profileData = profileDoc.exists()
                        ? profileDoc.data()
                        : {};
                    setProfileUser(profileData);
                } catch (error) {
                    toast.error("Something went wrong : ", error);
                } finally {
                    setLoading(false);
                }
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

    return (
        <div className="col-span-3 mt-3">
            {/* Information Personal */}
            <div className="grid  w-full grid-cols-6 rounded-lg bg-white  shadow-lg">
                <div className="col-span-1">
                    <div className="mt-3 p-4">
                        <img
                            src={
                                currentUser.photoURL
                                    ? currentUser?.photoURL
                                    : defaultAvt
                            }
                            alt="Avatar"
                            className="h-32 w-32 rounded-full object-cover  opacity-100 transition-opacity"
                        />
                    </div>
                </div>
                <div className="relative col-span-5">
                    <div className="h-2/5">
                        <div className="flex flex-row justify-between">
                            <div className="ml-3 mt-3 p-3">
                                <p className="text-2xl font-bold text-slate-700">
                                    {capitalized(currentUser?.displayName)}
                                </p>
                                <p
                                    className={`mt-2 text-lg font-bold text-gray-400 ${currentUser.title ? "font-bold text-slate-700" : ""}`}
                                >
                                    {currentUser.title
                                        ? currentUser.title
                                        : "Your title"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="col-span-1 ml-3  p-3">
                            <div className="mb-3 flex items-center gap-2 text-gray-400">
                                <Mail className="h-5 w-5" />{" "}
                                <span
                                    className={`${currentUser.email ? "text-slate-800" : ""}`}
                                >
                                    {currentUser.email
                                        ? currentUser.email
                                        : "Your email"}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center gap-2 text-gray-400">
                                <Gift className="h-5 w-5" />{" "}
                                <span
                                    className={`${currentUser.birthday ? "text-slate-800" : ""}`}
                                >
                                    {currentUser.birthday
                                        ? formatDate(currentUser.birthday)
                                        : "Your date of birth"}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center gap-2 text-gray-400">
                                <MapPin className="h-5 w-5" />{" "}
                                <span
                                    className={`${currentUser.address ? "text-slate-800" : ""}`}
                                >
                                    {currentUser.address
                                        ? currentUser.address
                                        : "Your current address"}
                                </span>
                            </div>
                        </div>

                        <div className="col-span-1  p-3">
                            <div className="mb-3 flex items-center gap-2 text-gray-400">
                                <Phone className="h-5 w-5" />{" "}
                                <span
                                    className={`${currentUser.phone ? "text-slate-800" : ""}`}
                                >
                                    {currentUser.phone
                                        ? currentUser.phone
                                        : "Your phone number"}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center gap-2 text-gray-400">
                                <User className="h-5 w-5" />{" "}
                                <span
                                    className={`${currentUser.gender ? "text-slate-800" : ""}`}
                                >
                                    {currentUser.gender
                                        ? capitalized(currentUser.gender)
                                        : "Your gender"}
                                </span>
                            </div>
                            <div className="mb-3 flex items-center gap-2 text-gray-400">
                                <Globe className="h-5 w-5" />{" "}
                                <span
                                    className={`${currentUser.personalLink ? "text-slate-800" : ""}`}
                                >
                                    {currentUser.personalLink
                                        ? currentUser.personalLink
                                        : "Your personal link"}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* edit button */}
                    <button onClick={handleModifyPersonalClick}>
                        <SquarePen className="absolute right-0 top-0 h-5 w-5 translate-x-[-150%] translate-y-6 cursor-pointer text-red-500" />
                    </button>
                </div>
            </div>
            {/* About & skill */}
            <ProfileContent
                title="About me"
                content="Introduce your strengths and years of experience"
                img={images.aboutImage}
                onModifyClick={handleModifyAboutMeClick}
                aboutMe={profileUser?.aboutMe}
                loading={loading}
            />
            <ProfileContent
                title="Education"
                content="Share your background education"
                img={images.educationImage}
                onModifyClick={handleModifyEducationClick}
            />
            <ProfileContent
                title="Work Experience"
                content="Highlight detailed information about your job history"
                img={images.workImage}
                onModifyClick={handleModifyWorkExperiencelClick}
            />
            <ProfileContent
                title="Skills"
                content="Showcase your skills and proficiencies"
                img={images.skillImage}
                onModifyClick={handleModifySkillClick}
            />
            <ProfileContent
                title="Personal Project"
                content="Showcase your personal project"
                img={images.projectImage}
                onModifyClick={handleModifyPersonalProjectClick}
            />
            <ProfileContent
                title="Certificates"
                content="Provides evidence of your specific expertise and skills"
                img={images.certificateImage}
                onModifyClick={handleModifyCertificateClick}
            />
            <ProfileContent
                title="Awards"
                content="Highlight your awards or recognitions"
                img={images.awardsImage}
                onModifyClick={handleModifyAwardClick}
            />
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

export default ProfileMain;
