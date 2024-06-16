import * as React from "react";
import Container from "@/components/layout/container";

import { NavLink } from "react-router-dom";

const ProfileNavbar = () => {
    const hover =
        "hover:border-b-[3px] hover:border-gray-400  transitions text-base font-semibold text-center text-gray-400 p-4 w-[165px]   ";
    const Hover = ({ isActive }) =>
        isActive
            ? "border-b-[3px] border-red-500 text-red-500 text-center text-base p-4 font-semibold w-[165px] "
            : hover;

    return (
        <div className="bg-white shadow-md">
            <Container>
                <div className="flex flex-row items-center gap-8">
                    <NavLink to="/profile-cv" end className={Hover}>
                        Profile
                    </NavLink>
                    <NavLink to="/profile-cv/manage-cv" className={Hover}>
                        Manage CVs
                    </NavLink>
                    {/* <NavLink to="/profile-cv/job-preferences" className={Hover}>
                        Job Preferences
                    </NavLink> */}
                </div>
            </Container>
        </div>
    );
};

export default ProfileNavbar;
