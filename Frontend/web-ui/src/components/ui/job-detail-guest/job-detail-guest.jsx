import { useEffect, useState } from "react";
import ApplyJobSection from "@/components/ui/job-detail-guest/apply-section";
import CompanyInfo from "@/components/ui/job-detail-guest/company-info";
import JobDetailsSection from "@/components/ui/job-detail-guest/job-details-section";
import BasicInfo from "@/components/ui/job-detail-guest/basic-info";
import JobCardSimilar from "@/components/ui/job-detail-guest/job-card";
import { useAuth } from "../../../contexts/authContext";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams, useNavigate } from "react-router-dom";

// const job_detail = {
//   "employerId": "hansentechnologies",
//   "jobStatus": "pending",
//   "jobId": "en232k4n234i2",
//   "jobSalary": "You'll love it",
//   "jobTitle": "Software Developer (Java)",
//   "jobLocation":  "100 Xuan Thuy Street, Thao Dien Ward, Thu Duc City, Ho Chi Minh",
//   "jobType": "Hybrid",
//   "jobSkills": "Java,SQL",
//   "jobTopReasons": "Global Company- Develop Your Career & English\nCompetitive Salary, and company profit share\nOnsite opportunities",
//   "jobDescription": "About The Role\nExciting opportunity for an enthusiastic Java Software Developer with at least 4 years of experience to join our CIS-P Team in Ho Chi Minh City. Take a key role in driving success as you collaborate with our team to provide enterprise CRM solutions to the utilities sector with key customers in Australia, Ireland, the USA and Japan.\nAbout You\nYou are an enthusiastic individual with proven experience and strong Java knowledge of J2EE, design patterns, core libraries and frameworks such as Spring, Hibernate and Java messaging frameworks. \nYou possess a curious nature and thrive in diverse technical environments, where your skills in SQL, exposure to DevOps, and experience working in Linux environments are highly valued.\nYou have good command of English and Vietnamese communication with eagerness to work with complicated business requirements, and implementation to technical specifications.",
//   "jobResponsibility": "Design, code, and test software as part of the Agile team\nUpdate status and technical documents in Jira\nTroubleshoot and escalate issues\nParticipate in R&D program where we are using Docker, Kafka, Kubernetes",
//   "jobRequirement": "Have strong Java knowledge: Java or Java EE (certified).\nGood English and Vietnamese communication.\nKnowledge of typical patterns, core libraries and frameworks.\nObject-Oriented Analysis, Design, and Implementation skills.\nHave solid SQL Knowledge.\nHave exposure to DevOps aspects including Bash Script and Perl on Linux.\nHave good skills in Enterprise Java, including:\nSpring and Hibernate.\nJava messaging (e.g., ActiveMQ).\nAre experienced and comfortable with:\nEclipse as the main IDE.\nWorking in an Agile environment (we use JIRA).\nHas actual experience working with Linux (e.g., Working daily on Linux as the main development environment).",
//   "jobBenefit": "Competitive Market Rate Salary - full salary (including SI contribution) during the probation period and 13th-month salary\nTwice yearly salary review\nFull participation in the annual Hansen Profit Share Program\nGreat Leave Options – including 12 days annual leave during Year 1, increasing to 15 days annual leave and 12 days paid sick leave per year).\nPremium healthcare for employee and dependents (spouse and {all} children and support for parents). Also, free comprehensive annual check-up for employees.\nHigh-speed Internet credit: VND 5,5million/year\nWellness benefit: VND 2million annually for fitness package/devices\nFree lunch, snacks, and drink in our new modern offices, which have a cool open atmosphere with an outdoor cafe, bar, and recreation area in District 2 – including free scooter parking\nContinuous Learning and Development, including personalised LinkedIn Learning – online content platform.\nWork from Home opportunities supported.\nReward and Recognition - Company sponsored trips and events, tenure milestones and global recognition program.\nNew, modern developer laptop, 2 large monitors, and headset.\nAn international work environment, highly skilled colleagues to learn from both locally and globally where you can develop your IT career and English skills.",
//   "employerInfo": {
//       "companyName": "Hansen Technologies",
//       "companyType": "IT Product",
//       "companySize": "100 - 150",
//       "country": "Australia",
//       "workingDays": "Monday - Friday",
//       "overtimePolicy": "No OT",
//       "companyOverview": "Closing the Distance",
//       "keySkills": ".......",
//       "whyLoveWorkingHere": ".......",
//       "logoUrl": "https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBKzU2TWc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--8e742bd0e69c208965fc50909defe9ab3c64c42b/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RW5KbGMybDZaVjkwYjE5bWFYUmJCMmtCcWpBPSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--79eee5883893a012786006950460867831e6f661/image_2023_02_16T04_32_21_317Z.png",
//       "location": "...........",
//       "workType": "hardcode",
//       "image": "https://cdn.builder.io/api/v1/image/assets/TEMP/d5daf5335140db7fa166023188d3eb55c01cfa497937c6436722a294b7d9b22d?apiKey=1293b2add2d347908b4e11760098fdbe&"
//   }
// }
const JobDetailGuestPage = () => {
  const {jobId} = useParams();
  const [isSticky, setIsSticky] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const { currentUser}  = useAuth();
  const navigate  = useNavigate();
  console.log("currentUser: ", currentUser);
  //Call API get job infor
  const fetchJobData = async (jobId) => {
    setIsLoading(true);
    try {
      console.log(`https://job-search-service.azurewebsites.net/job-elastic/job-by-id/${jobId}`);
        const response = await fetch(`https://job-search-service.azurewebsites.net/job-elastic/job-by-id/${jobId}`);
        console.log("response: ", response);
        if (!response.ok) {
          toast.error("Network response was not ok");
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("data: ", data);  
        setJobData(data);
        toast.success("Fetching JobData was OK!!!");
        setIsLoading(false);
        
    } catch (error) {
      toast.error("Error fetching JobData:");
      console.error('Error fetching JobData:', error);
      navigate("/")
    }
  };
  useEffect(()=>{
    fetchJobData(jobId);
    //fetchJobData("f50d430a-3e5c-4a21-be2b-075b3a790e13");
    //fetchJobData("ce4a22d5-34cd-44aa-ab8e-cd90fd59b96b");

    const handleScroll = () => {
      if (window.scrollY > 800) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }

    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  

  return (
    <>
      {jobData && !isLoading ? 
        <div className=" p-[30px] pb-[150px] bg-gray-200 bg-opacity-50">
        {/* Background */}
        <div className="absolute inset-0 left-[-12%] top-0 bg-linear-gradient rounded-br-[50%] rounded-bl-[70%] h-[400px] "></div>

        {/* Content Body */}
        <div className="grid grid-cols-3 gap-4 relative ">
          {/* Information about the job */}
          <div className="col-span-2 pb-8">
            {/* Job title */}
            <div className={`top-[60px] bg-white rounded-t-md ${isSticky ? "sticky" : ""}`} style={{ zIndex: 1 }}>
              <ApplyJobSection job_detail={jobData}/>
            </div>

            <BasicInfo job_detail={jobData} />

            {/* Job description */}
            <div id="job-detail-section">
              <JobDetailsSection job_detail= {jobData} />
            </div>

            {/* <SimilarJobsSection /> */}
            <h2 className="similar-jobs-title">More jobs for you</h2>
            <div className="email-notification">
              <div className="notification-text">Get similar jobs by email</div>
              <button className="notification-button">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/a712dabd9eea41313a1d865e4b2206ec7985cb6ecefbca9eac944936af76bc5d?apiKey=1293b2add2d347908b4e11760098fdbe&" alt="" className="notification-icon" />
                <span className="button-text">Subscribe</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <JobCardSimilar
                labels={["Android", "Kotlin", "Flutter"]}
                time="Đăng 5 ngày trước"
                companyLogo="https://cdn.builder.io/api/v1/image/assets/TEMP/d5cef94958a49fc66e4384dee5b730d0cb3317ed17f0641d763a3b0d3ae906be?apiKey=1293b2add2d347908b4e11760098fdbe&"
                companyName="FuelCloud"
                salary="Đăng nhập để xem mức lương"
                position="Tại văn phòng"
                location="Hồ Chí Minh"
                tag="Hot"
                jobTitle="Senior Android Developer (Kotlin, Flutter)"
              />
              <JobCardSimilar
                labels={["Android", "Kotlin", "Flutter"]}
                time="Đăng 5 ngày trước"
                companyLogo="https://cdn.builder.io/api/v1/image/assets/TEMP/d5cef94958a49fc66e4384dee5b730d0cb3317ed17f0641d763a3b0d3ae906be?apiKey=1293b2add2d347908b4e11760098fdbe&"
                companyName="FuelCloud"
                salary="Đăng nhập để xem mức lương"
                position="Tại văn phòng"
                location="Hồ Chí Minh"
                tag="Hot"
                jobTitle="Senior Android Developer (Kotlin, Flutter)"
              />
              <JobCardSimilar
                labels={["Android", "Kotlin", "Flutter"]}
                time="Đăng 5 ngày trước"
                companyLogo="https://cdn.builder.io/api/v1/image/assets/TEMP/d5cef94958a49fc66e4384dee5b730d0cb3317ed17f0641d763a3b0d3ae906be?apiKey=1293b2add2d347908b4e11760098fdbe&"
                companyName="FuelCloud"
                salary="Đăng nhập để xem mức lương"
                position="Tại văn phòng"
                location="Hồ Chí Minh"
                tag="Hot"
                jobTitle="Senior Android Developer (Kotlin, Flutter)"
              />


            </div>


          </div>

          {/* Description about Company */}
          <div className="col-span-1 max-w-[420px] ">
            <div id="company-info" className={`top-[60px] sticky`}>
              <CompanyInfo job_detail={jobData}/>
            </div>
          </div>
        </div>
      </div> 
      : <div className="flex h-screen items-center justify-center">
          <ClipLoader
              color="rgba(239, 68, 68, 1)"
              size={40}
              speedMultiplier={1}
              className="mt-4 "
          />
      </div> }
      <style >{`
        
        .similar-jobs-title {
          color: #121212;
          width: 100%;
          margin-top: 30px;
          font: 700 22px Lexend, sans-serif;
        }
        
        @media (max-width: 991px) {
          .similar-jobs-title {
            max-width: 100%;
          }
        }
        
        .email-notification {
          justify-content: center;
          border-radius: 8px;
          box-shadow: 0px 6px 32px 0px rgba(0, 0, 0, 0.08);
          background-color: #fff;
          display: flex;
          margin-top: 27px;
          width: 100%;
          gap: 20px;
          font-size: 16px;
          text-align: center;
          padding: 24px 17px;
        }
        
        @media (max-width: 991px) {
          .email-notification {
            max-width: 100%;
            flex-wrap: wrap;
          }
        }
        
        .notification-text {
          color: #121212;
          font-family: Lexend, sans-serif;
          font-weight: 400;
          flex-grow: 1;
          flex-basis: auto;
          margin: auto 0;
          text-align: start;
        }
        
        .notification-button {
          justify-content: center;
          border-radius: 4px;
          border: 1px solid #ed1b2f;
          background-color: #fff;
          display: flex;
          gap: 9px;
          color: #ed1b2f;
          font-weight: 500;
          padding: 10px 21px;
          cursor: pointer;
        }
        
        @media (max-width: 991px) {
          .notification-button {
            padding: 0 20px;
          }
        }
        
        .notification-icon {
          width: 20px;
          height: 20px;
        }
        
        .button-text {
          font-family: Lexend, sans-serif;
          flex-grow: 1;
          flex-basis: auto;
        }
        
      `}</style>
    </>
  );
};



export default JobDetailGuestPage;
