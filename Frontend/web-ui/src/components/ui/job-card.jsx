import React from "react";
import { MapPin,  CircleDollarSign,  Joystick} from "lucide-react";
const JobCard = ({date, tag, jobTitle, companyLogo, companyName, salary, position, location, labels} ) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
          <div className=" text-sm text-gray-500 mr-4">{date}</div>
          {tag && <div className=" p-1 text-sm font-medium text-white bg-blue-700 right-[-24px] rounded-l-md ">{tag}</div>}
      </div>
      <h3 className=" text-lg font-bold  ">{jobTitle}</h3>
      <div className="my-2">
          <a href="#" className="flex items-center" >
              <img className=" rounded-sm h-[48px] min-w-[48px] mr-4" src={companyLogo} alt={companyName}  />
              <span >{companyName}</span>
          </a>
      </div>
      <div className="flex space-x-2 text-green-500 font-bold items-center py-4 border-dotted border-gray-400 border-b-2" > <CircleDollarSign size={16}/> <span>{salary}</span></div>
      
      <div className="flex my-2 items-center text-sm">
          <span className="text-gray-500 mr-2 "><Joystick  size={16} /></span>
          <span> {position}</span>
          
      </div>
      <div className="flex my-2 items-center text-sm">
          <span className="text-gray-500 mr-2 "><MapPin size={16} /></span>
          <span> {location}</span>
      </div>
      <div className="flex items-center">
        {labels.map((label, index) => (
          <a key={index} href="#" className=" text-xs text-gray-600 mx-1 rounded-full border border-solid border-gray-300 px-2 py-1">
              <div className=" "> {label}</div>
          </a>
          ))}
          
          
      </div>
  </div>

      
  );
};

export default JobCard;