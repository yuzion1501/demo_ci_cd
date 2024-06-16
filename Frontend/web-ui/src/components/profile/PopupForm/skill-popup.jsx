import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

const SkillPopup = ({ userInfo, onClose }) => {
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

    const [skill, setSkill] = useState("");
    const [level, setLevel] = useState("");
    const [formData, setFormData] = useState({
        excellent: [],
        intermediate: [],
        beginner: [],
    });

    const handleAddSkill = () => {
        if (skill && level) {
            setFormData((prevState) => ({
                ...prevState,
                [level.toLowerCase()]: [
                    ...prevState[level.toLowerCase()],
                    skill,
                ],
            }));
            setSkill("");
            setLevel("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div
            id="work-experience-popup"
            className="fixed left-0 right-0 top-0 z-[999] flex h-full w-full items-center justify-center bg-black/50"
        >
            <div
                ref={popupRef}
                className="mt-10 flex h-[40%] max-h-[90vh] w-[50%] flex-col justify-between overflow-auto  rounded-lg bg-white p-8 shadow-md transition-all duration-300 ease-in-out"
            >
                <div className="flex items-center justify-between">
                    <h2 className=" text-xl font-semibold text-slate-700">
                        Skills
                    </h2>
                    <button onClick={onClose}>
                        <X className="h-6 w-6 text-slate-700" />
                    </button>
                </div>
                <hr />
                <br></br>

                <form
                    onSubmit={handleSubmit}
                    className=" w-full rounded-lg bg-white"
                >
                    <div>
                        <div className="mb-4 flex space-x-2">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => setSkill(e.target.value)}
                                placeholder="Search skills"
                                className="w-3/5 rounded-md border p-2"
                            />
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="w-2/5 rounded-md border p-2"
                            >
                                <option value="">Select level</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Intermediate">
                                    Intermediate
                                </option>
                                <option value="Beginner">Beginner</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="rounded-md border border-rose-500 p-2 text-red-500 hover:bg-rose-200"
                            >
                                Add
                            </button>
                        </div>
                        <br></br>
                        <div>
                            <h3 className=" mb-2 font-semibold">Excellent</h3>
                            <ul className="mb-4 list-disc pl-5">
                                {formData.excellent.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className=" mb-2 font-semibold">
                                Intermediate
                            </h3>
                            <ul className="mb-4 list-disc pl-5">
                                {formData.intermediate.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className=" mb-2 font-semibold">Beginner</h3>
                            <ul className="mb-4 list-disc pl-5">
                                {formData.beginner.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="rounded bg-white px-8 py-2 text-black"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-red-500 px-8 py-2 text-white"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SkillPopup;
