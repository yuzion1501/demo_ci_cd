import {  CircleDollarSign, Heart } from "lucide-react";
import {useState} from "react";
import PropTypes from 'prop-types';
import { useAuth } from "@/contexts/authContext";
import { Link } from "react-router-dom";
import { Button } from "../button";
function ApplyJobSection({job_detail})  {
  const { currentUser} = useAuth();
  const [isClickedHeart, setIsClickedHeart] = useState(false);
  return (
    <>
      <article className="job-listing">
        <header>
          <h2 className="job-title">{job_detail?.jobTitle}</h2>
          <div className="company-name-apply">{job_detail?.employerInfo.companyName}</div>
        </header>
        <div className="salary-info">
          
          {!currentUser ? 
            <div className="flex space-x-2 underline"> <CircleDollarSign /> <span>Sign in to view salary</span></div> :  
            <div className="flex space-x-2 text-green-500" >   <CircleDollarSign /> <span>{job_detail?.jobSalary}</span> </div> }
        </div>
        <footer className="flex justify-between mt-[24px]">
          <Link className="w-11/12 h-[48px]" to={{
              pathname: `/form-apply-job/${job_detail?.jobId}`,
              state: { job_detail },
            }}><Button className="w-full h-[48px] bg-[#ED1B2F] hover:bg-[#C82222]" > Apply Now </Button></Link>
          <Heart onClick={() => setIsClickedHeart(!isClickedHeart)} className={`w-1/12 m-auto h-[32px] text-[#ED1B2F] cursor-pointer ${isClickedHeart ? " fill-[#ED1B2F]" : '' }`}/>
        </footer>
      </article>

      <style>{`
        .job-listing {
          background-color: #fff;
          border-radius: 8px 8px 0px 0px;
          color: #414042;
          display: flex;
          flex-direction: column;
          font-size: 16px;
          font-weight: 700;
          line-height: 150%;
          // max-width: 893px;
          padding: 33px 20px 12px;
          z-index: 1;
        }

        .job-title {
          color: #121212;
          font: 32px Lexend, sans-serif;
          font-size: 28px;
          font-weight: 700;
          padding: 0 0 20px 0;
          margin: 0;
        }

        @media (max-width: 991px) {
          .job-title {
            max-width: 100%;
          }
        }

        .company-name-apply {
          font-family: Lexend, sans-serif;
          font-size: 16px;
          color: #414042;
          margin: 16px 0px 12px;
        }

        @media (max-width: 991px) {
          .company-name-apply {
            max-width: 100%;
          }
        }

        .salary-info {
          align-self: start;
          display: flex;
          gap: 8px;
          font-size: 18px;
          margin-top: 15px;
        }

        .icon {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 24px;
        }

        .salary-text {
          flex-basis: auto;
          flex-grow: 1;
          font-family: Lexend, sans-serif;
          text-decoration-line: underline;
        }

        .actions {
          display: flex;
          gap: 16px;
          color: #fff;
          font-weight: 600;
          margin-top: 26px;
          height: 48px;
        }

        @media (max-width: 991px) {
          .actions {
            flex-wrap: wrap;
            max-width: 100%;
          }
        }

        .apply-button {
          align-items: center;
          background-color: #ed1b2f;
          border-color: rgba(237, 27, 47, 1);
          border-radius: 4px;
          border-style: solid;
          border-width: 1px;
          flex-grow: 1;
          font-family: Lexend, sans-serif;
          justify-content: center;
          padding: 15px 60px;
          width: fit-content;
        }

        @media (max-width: 991px) {
          .apply-button {
            max-width: 100%;
            padding: 0 20px;
          }
        }

        .bookmark-icon {
          aspect-ratio: 1;
          margin: auto 0;
          object-fit: auto;
          object-position: center;
          width: 32px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}


ApplyJobSection.propTypes = {
  job_detail: PropTypes.object.isRequired,
};


export default ApplyJobSection;