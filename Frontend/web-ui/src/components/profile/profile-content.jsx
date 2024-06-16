import React from "react";

import { CirclePlus, SquarePen } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";

const ProfileContent = ({
    title,
    content,
    img,
    icon,
    onModifyClick,
    aboutMe,
    coverLetter,
    loading,
}) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <ClipLoader
                    color="rgba(239, 68, 68, 1)"
                    size={40}
                    speedMultiplier={1}
                    className="mt-4 "
                />
            </div>
        );
    }
    if (coverLetter) {
        return (
            <div>
                <div className="relative mt-4 flex w-full flex-col justify-center rounded-lg bg-white px-2 pb-8 pt-2 shadow-lg">
                    <div className="mx-6 mt-3 flex border-b border-gray-400 py-4 pt-4 ">
                        <p className="text-xl font-bold text-slate-700">
                            {title}
                        </p>
                        <button onClick={onModifyClick}>
                            <SquarePen className="absolute right-0 top-0 h-5 w-5 translate-x-[-150%] translate-y-6 cursor-pointer text-red-500" />
                        </button>
                    </div>

                    <div className=" flex flex-row px-6 py-4">
                        <p className=" font-base text-base text-slate-700">
                            {coverLetter}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    if (aboutMe) {
        return (
            <div>
                <div className="relative mt-4 flex w-full flex-col justify-center rounded-lg bg-white shadow-lg">
                    <div className="mx-6 mt-3 flex border-b border-gray-400 py-4 pt-4 ">
                        <p className="text-xl font-bold text-slate-700">
                            {title}
                        </p>
                        <button onClick={onModifyClick}>
                            <SquarePen className="absolute right-0 top-0 h-5 w-5 translate-x-[-150%] translate-y-6 cursor-pointer text-red-500" />
                        </button>
                    </div>

                    <div className=" flex flex-row px-6 py-4">
                        <p className=" font-base text-base text-slate-700">
                            {aboutMe}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="relative mt-4 flex  w-full flex-row justify-between rounded-lg bg-white shadow-lg">
                <div className="ml-2 mt-3 p-4">
                    <p className="text-xl font-bold text-slate-700">{title}</p>
                    <p className="mt-2 text-base text-gray-400"> {content}</p>
                </div>
                <div className="mr-16 mt-3 flex flex-row p-4">
                    <div>
                        <img src={img} alt="img" />
                    </div>

                    <button onClick={onModifyClick}>
                        {icon ? (
                            <SquarePen className="absolute right-0 top-0 h-5 w-5 translate-x-[-150%] translate-y-6 cursor-pointer text-red-500" />
                        ) : (
                            <CirclePlus className="absolute right-0 top-0 h-5 w-5 translate-x-[-150%] translate-y-6 cursor-pointer text-red-500" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
