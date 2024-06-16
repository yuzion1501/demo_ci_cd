import React, { useState, useRef, useEffect } from "react";
import { X, Lightbulb } from "lucide-react";

import { db } from "../../../firebase/firebase";
import { setDoc, doc, updateDoc } from "firebase/firestore";

import { toast } from "react-toastify";

import { Label } from "@radix-ui/react-dropdown-menu";

const CoverLetterPopup = ({ userInfo, onClose, coverLetter }) => {
    const popupRef = useRef(null);

    // Click background close popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const [content, setContent] = useState(coverLetter ? coverLetter : "");
    const [charCount, setCharCount] = useState(
        coverLetter ? coverLetter.length : 0,
    );
    const [updating, setUpdating] = useState(false);
    const maxChars = 500;

    const handleChange = (e) => {
        const { value } = e.target;
        setContent(value);
        setCharCount(value.length);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // send or handle data in server

        // Store aboutMe user in Firestore
        setUpdating(true);
        try {
            await updateDoc(doc(db, "users", userInfo.uid), {
                "cv.coverLetter": content,
            });

            toast.success("Update Cover Letter successfully ");
        } catch (error) {
            toast.error("Error update user Cover Letter :", error);
        } finally {
            setUpdating(false);
        }

        onClose();
    };

    return (
        <div
            id="work-experience-popup"
            className="fixed left-0 right-0 top-0 z-[999] flex h-full w-full items-center justify-center bg-black/50"
        >
            <div
                ref={popupRef}
                className="mt-10 flex h-[55%] max-h-[90vh] w-[50%] flex-col justify-between overflow-auto  rounded-lg bg-white p-8 shadow-md transition-all duration-300 ease-in-out "
            >
                <div>
                    <div className="mb-2 flex justify-between">
                        <h2 className="mb-4 text-xl font-semibold text-slate-700">
                            Cover Letter
                        </h2>
                        <button onClick={onClose}>
                            <X className="h-6 w-6 text-slate-700" />
                        </button>
                    </div>
                    <hr />
                    <div className="mt-4">
                        <Label
                            htmlFor="coverLetter"
                            className="flex items-center gap-2"
                        >
                            <Lightbulb className="h-6 w-6 rounded bg-orange-400 p-1 font-extrabold text-white " />
                            <span className="font-bold text-orange-400">
                                Tips :
                            </span>
                            <p className="text-slate-700 ">
                                Start by describing what you bring to the table
                                and why this job excites you
                            </p>
                        </Label>
                        <textarea
                            name="content"
                            placeholder="Type cover letter here..."
                            id="coverLetter"
                            className="mb-2 mt-4 min-h-[240px] w-full rounded-md border border-gray-300 px-3 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={handleChange}
                            maxLength={maxChars}
                            value={content}
                        />
                        <p className="text-sm text-muted-foreground">
                            {charCount}/{maxChars} characters
                        </p>
                    </div>
                </div>
                <hr />
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 rounded bg-white px-8 py-2 text-black"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className={`rounded px-8 py-2 text-white ${updating ? "bg-gray-500" : "bg-red-500 "}`}
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterPopup;
