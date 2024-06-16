import * as React from "react";
import Container from "@/components/layout/container";

import { NavLink } from "react-router-dom";

const EmployeeJobNavbar = () => {
    const Hover =
        "hover:border-b-[3px] hover:border-red-500  hover:text-red-500 transitions text-base font-semibold text-center text-gray-400 p-4 w-[165px]";


    return (
        <div className="bg-white shadow-md">
          <div className="ml-5 flex flex-row w-full items-center gap-8">
              <NavLink to="/my-jobs" className={Hover}>
                  Saved Jobs
              </NavLink>
              <NavLink to="/my-jobs/recent-viewed" className={Hover}>
                Recent Viewed Jobs
              </NavLink>
              <NavLink to="/my-jobs/applied" className={Hover}>
                Applied Jobs
              </NavLink>
          </div>
        </div>
    );
};

export default EmployeeJobNavbar;



