import * as React from "react";
import Container from "@/components/layout/container";
import { useState, useEffect } from "react";

import ProfileNavbar from "./profile-navbar";
import ProfileContent from "./profile-content";

import { Upload, FileText, Check } from "lucide-react";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

import CoverLetterPopup from "./PopupForm/cover-letter-popup";
import ClipLoader from "react-spinners/ClipLoader";

import { useAuth } from "../../contexts/authContext";

// Component loading đơn giản
const LoadingSpinner = () => (
    <div className="flex h-full items-center justify-center">
        <ClipLoader
            color="rgba(239, 68, 68, 1)"
            size={40}
            speedMultiplier={1}
            className="mt-4 "
        />
    </div>
);

const ProfileManagementCv = () => {
    const { currentUser } = useAuth();

    const [fileUpload, setFileUpload] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);
    const [uploading, setUploading] = useState(false); // Thêm trạng thái uploading
    const [initialFileInfo, setInitialFileInfo] = useState(null); // Trạng thái CV ban đầu
    const [fileUploaded, setFileUploaded] = useState(false); // Thêm trạng thái này
    const [coverLetter, setCoverLetter] = useState(null);
    const [loading, setLoading] = useState(true); // Trạng thái loading

    const [isOpenPopup, setisOpenPopup] = useState(false); // popup cover letter

    const handleModifyCoverLetterClick = () => {
        setisOpenPopup(true);
    };

    useEffect(() => {
        const fetchCVInfo = async () => {
            setLoading(true); // Bắt đầu loading
            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData && userData.cv) {
                        const isoDateString = userData.cv.uploadedDate;
                        const date = new Date(isoDateString);
                        const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

                        // Lấy tên file gốc từ fileName
                        const originalFileName = userData.cv.fileName
                            .split("_")
                            .slice(0, -1)
                            .join("_");

                        // Sử dụng để lấy url download
                        const fileRef = ref(
                            storage,
                            `cvs/${userData.cv.fileName}`,
                        );

                        const url = await getDownloadURL(fileRef);

                        const initialFileInfo = {
                            ...userData.cv,
                            uploadedDate: formattedDate,
                            fileName: originalFileName,
                            url,
                        };

                        setCoverLetter(userData.cv?.coverLetter);
                        setFileInfo(initialFileInfo);
                        setInitialFileInfo(initialFileInfo); // Lưu trạng thái CV ban đầu
                    }
                }
            } catch (error) {
                // Handle errors with toast notifications
                handleAuthError(error);
                console.error("Error fetching CV info:", error);
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        fetchCVInfo();
    }, [currentUser, fileUploaded, isOpenPopup]); // Fetch lại thông tin CV khi currentUser thay đổi

    const handleAuthError = (error) => {
        switch (error.code) {
            case "storage/object-not-found":
                toast.error("Oops! File doesn't exist !");
                break;
            case "storage/unauthorized":
                toast.error(
                    "Oops! You don't have permission to access the file !",
                );
                break;
            case "storage/canceled":
                toast.error("Oops! Download was canceled !");
                break;
            case "storage/unknown":
                toast.error("Oops! An unknown error occurred !");
                break;
            default:
                toast.error(`Oops ! Something went wrong. : ${error.message}`);
                break;
        }
    };

    // change file
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Kiểm tra phần mở rộng của file
        const allowedExtensions = ["doc", "docx", "pdf"];
        const extension = file.name.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            toast.error("Oops! Please attach a .doc .docx .pdf file");
            return;
        }

        // Kiểm tra kích thước của file (đơn vị là byte)
        const maxSize = 3 * 1024 * 1024; // 3MB
        if (file.size > maxSize) {
            toast.error(
                "Oops! Please attach a file size exceeds the limit of 3MB.",
            );
            return;
        }
        // Update file info
        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${currentDate.getFullYear()}`;
        setFileInfo({
            fileName: file.name,
            uploadedDate: formattedDate,
        });

        setFileUpload(file);
    };

    // Submit file
    const uploadCv = async () => {
        if (!fileUpload || uploading) return; // Kiểm tra nếu không có file hoặc đang uploading thì không thực hiện gì

        setUploading(true); // Bắt đầu uploading
        const v4Id = v4(); // Tạo giá trị v4 duy nhất

        // Tạo tên file cho cả Firestore và Storage
        const fileName = `${fileUpload.name}_${v4Id}`;
        const fileRef = ref(storage, `cvs/${fileName}`);
        try {
            // Tải file lên Storage
            await uploadBytes(fileRef, fileUpload);

            // Nếu upload thành công, cập nhật thông tin về file vào Firestore Database
            const userDocRef = doc(db, "users", currentUser.uid);
            await setDoc(
                userDocRef,
                {
                    cv: {
                        fileName: fileName,
                        uploadedDate: new Date().toISOString(), // hoặc định dạng ngày tháng năm
                    },
                },
                { merge: true },
            ); // sử dụng merge để cập nhật thông tin mà không ghi đè tài liệu đang tồn tại

            toast.success("Your CV has been uploaded successfully");
            setFileUploaded(true); // Cập nhật trạng thái khi file được upload
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload CV");
        } finally {
            setUploading(false); // Kết thúc uploading
        }
    };

    const hasCVChanged = () => {
        // Trường hợp người dùng mới chưa có CV
        if (!initialFileInfo && fileInfo) {
            return true;
        }

        // Trường hợp người dùng đã có CV
        return (
            fileInfo &&
            initialFileInfo &&
            fileInfo.fileName !== initialFileInfo.fileName
        );
    };

    return (
        <div className="min-h-screen bg-gray-200">
            <ProfileNavbar />

            <Container className="max-w-[1000px] pb-10 pt-4">
                <div className="mt-4 flex w-full flex-col rounded-lg bg-white shadow-lg">
                    <div className="ml-2 mt-3 p-6">
                        <p className="text-xl font-bold text-slate-700">
                            Manage CVs
                        </p>
                        <p className="my-6 text-base text-gray-400">
                            Upload your CV below to use it throughout your
                            application process
                        </p>
                        <div className="w-100 mb-7 rounded-md border-2 border-gray-300 p-5 shadow-sm">
                            <div className="relative flex items-center justify-start gap-5">
                                <FileText className="h-12 w-12 text-gray-500" />
                                {loading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <div className="flex flex-grow flex-col items-start gap-2">
                                        <p className="text-base font-semibold text-slate-700">
                                            Your own CV
                                        </p>
                                        {fileInfo && (
                                            <div className="flex flex-col gap-2">
                                                <p className="text-base text-gray-700 underline">
                                                    <a
                                                        className="no-underline"
                                                        target="_blank"
                                                        href={fileInfo.url}
                                                    >
                                                        {" "}
                                                        {fileInfo.fileName}{" "}
                                                    </a>
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    Uploaded :{" "}
                                                    {fileInfo.uploadedDate}
                                                </p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                style={{ display: "none" }}
                                                id="fileInput"
                                                accept=".doc, .docx, .pdf"
                                            />
                                            <label
                                                htmlFor="fileInput"
                                                className={`flex cursor-pointer items-center gap-2 ${uploading ? "pointer-events-none" : ""}`}
                                            >
                                                <Upload className="h-5 w-5 text-blue-400" />
                                                <span className="text-blue-600">
                                                    {uploading
                                                        ? "Uploading..."
                                                        : fileInfo
                                                          ? "Upload new"
                                                          : "Upload"}
                                                </span>
                                            </label>
                                            <span className="text-base text-gray-400">
                                                (Use .doc, .docx or .pdf files,
                                                3MB and no password protected)
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <button
                                    className={`absolute bottom-0 right-0 flex items-center justify-center gap-2 rounded p-2 text-sm font-bold text-white ${!fileInfo || !hasCVChanged() || uploading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
                                    onClick={uploadCv}
                                    disabled={
                                        !fileInfo ||
                                        !hasCVChanged() ||
                                        uploading
                                    }
                                >
                                    <Check className="h-4 w-4 font-bold text-white" />
                                    {uploading ? "Saving...." : "Saving CV"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ProfileContent
                    title="Cover Letter"
                    content="Introduce yourself and why you'd make a great hire"
                    img="https://itviec.com/assets/profile/cover_letter_no_info-f9d084dcc48161f6e480d74ea191ad4421e4b7fb2fe89dd2c29a2fdd90f46d49.svg"
                    icon={true}
                    coverLetter={coverLetter ? coverLetter : null}
                    onModifyClick={handleModifyCoverLetterClick}
                    loading={loading}
                />
            </Container>

            {isOpenPopup && (
                <CoverLetterPopup
                    userInfo={currentUser}
                    coverLetter={coverLetter ? coverLetter : null}
                    onClose={() => setisOpenPopup(false)}
                />
            )}
        </div>
    );
};

export default ProfileManagementCv;
