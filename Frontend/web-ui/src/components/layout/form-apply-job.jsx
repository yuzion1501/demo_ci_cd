// Components
import { useEffect, useState } from "react";
import {Link, useParams, useNavigate} from "react-router-dom"
import Logo from "../../assets/logo-fitviec.webp";
import { ChevronLeft, Eye } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { toast } from "react-toastify";
//import firebase
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import ClipLoader from "react-spinners/ClipLoader";
import { StoreAppliedJob } from "../Employee/employee-job-management";

// const job_detail = {
//   "employerId": "hansentechnologies",
//   "jobStatus": "pending",
//   "jobId": "7e34bcf6-c679-4f60-b00f-61c525c87397",
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
const FormApplyJob = () => {
    const { currentUser} = useAuth();
    const {jobId} = useParams();
    console.log(jobId);
    console.log("currentUser form apply: ", currentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [cvOption, setCvOption] = useState('current');
    const [name, setName] = useState(currentUser?.displayName || '');   
    const [coverLetter, setCoverLetter] = useState('');
    const [jobData, setJobData] = useState(null);
    const [nameError, setNameError] = useState('');
    const [newFileUrl, setNewFileUrl] = useState('');
    const [currentCV, setCurrentCV] = useState(null);

    //Chưa đăng nhập chuyển sang trang SignIn
    const navigate = useNavigate();
    useEffect(() => {
        //setIsLoading(true);
        if (!currentUser) {
            navigate("/sign_in");
        }
        if(!currentUser?.cv?.fileName){
            setCvOption('new');
            
            //setIsLoading(false);
        }
        handleFileUrl();    //Lấy thông tin currentCV
        console.log("currentCV: ", currentCV);
        // Fetch job detail here if needed and set it to state
    }, [currentUser, navigate]);

    const handleFileUrl = async ()=>{
        // Lấy tên file gốc từ fileName
        const originalFileName = currentUser.cv.fileName
        .split("_")
        .slice(0, -1)
        .join("_");
        // Sử dụng để lấy url download
        const fileRef = ref(
            storage,
            `cvs/${currentUser.cv.fileName}`,
        );
        const url = await getDownloadURL(fileRef);
        const initialFileInfo = {
            fileName: originalFileName,
            url,
        };
        setCurrentCV(initialFileInfo);
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        // Kiểm tra phần mở rộng của file
        setCvOption('new');
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
        storeFile(file);
    };

    //Submit file
    const storeFile = async (file) => {
        if (!file) return ; 
        const v4Id = v4(); // Tạo giá trị v4 duy nhất
        // Tạo tên file cho cả Firestore và Storage
        const fileName = `${file.name}_${v4Id}`;
        const fileRef = ref(storage, `cvs/${fileName}`);
        try {
            // Tải file lên Storage
            await uploadBytes(fileRef, file);
            const newUrl = await getDownloadURL(fileRef);
            setNewFileUrl(newUrl);
            toast.success("Your CV has been uploaded successfully");
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload CV");
        } 
    };

    const handleCoverLetterChange = (e) => {
        const inputValue = e.target.value;
        // Giới hạn độ dài của cover letter không quá 500 ký tự
        if (inputValue.length <= 500) {
            setCoverLetter(inputValue);
        }
    };
    const handleInputNameChange = (e) => {
        const value = e.target.value;
        console.log("value: ", value);
        // Validate name (must be at least 2 characters long and contain only letters and spaces)
        if (value.length < 2) {
          setNameError('Name must be at least 2 characters long.');
        } else {
          setNameError('');
        }
        setName(value);
    };
    //Call API get job infor
    useEffect(()=>{
        const fetchJobData = async (jobId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://job-search-service.azurewebsites.net/job-elastic/job-by-id/${jobId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("job-data: ", data);
            setJobData(data);
            toast.success("Fetching JobData was OK!!!");
            setIsLoading(false);
            
        } catch (error) {
            toast.error("Error fetching JobData");
            console.error('Error fetching JobData:', error);
        }
        };
        console.log("call fetch");
        fetchJobData(jobId);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("newFileUrl: ", newFileUrl);
        console.log("currentCV?.url: ", currentCV?.url);
        if ((cvOption === "new" && !newFileUrl) || (cvOption === "current" && !currentCV?.url)) {
            toast.error('Please select a file before submitting');
            console.error('Please select a file before submitting');
            return;
        }
    
        try {
            let cvUrl = cvOption === "new" ? newFileUrl : currentCV?.url;
    
            const data = {
                jobSeekerId: currentUser?.uid,
                employerId: jobData?.employerId,
                applicationName: name,
                jobId: jobId, // jobId đã được nhận từ useParams
                coverLetter: coverLetter,
                cvLink: cvUrl // url đã nhận được từ uploadCV
            };
            console.log("+++ data: ", data);
    
            const response = await fetch('https://application-service-otwul2bnna-uc.a.run.app/application/create', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: currentUser?.accessToken
                },
                method: 'POST',
                body: JSON.stringify(data),
            });

            // nếu đã apply thành công thì lưu lại là job này đã applied
            if (response.ok) {
                StoreAppliedJob(jobId,currentUser)
            }

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }
    
            toast.success("Application submitted successfully!");
            console.log('Application submitted successfully');
        } catch (error) {
            toast.error("Error submitting application!");
            console.error('Error submitting application:', error);
        }
    };
    
    

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">
            <ClipLoader
                color="rgba(239, 68, 68, 1)"
                size={40}
                speedMultiplier={1}
                className="mt-4 "
            />
        </div>;
      }
    return (
        <div className=" p-[30px] pb-[150px] bg-gray-200 bg-opacity-50">
        {/* Background */}
        <div className="absolute inset-0 left-[-12%] right-[-12%] top-0 bg-linear-gradient rounded-br-[50%] rounded-bl-[50%] h-[400px] "></div>
        
        <div className=" max-w-[884px] ml-auto mr-auto relative">
            {/* Logo */}
            <div className="flex items-center justify-center relative h-[80px] ">
                <Link to={`/job-detail/${jobId}`} className="  flex text-white absolute left-0"> <ChevronLeft /> Back</Link>
                <div className=""><img src={Logo} alt="Logo" className="w-[81px]" /></div>
            </div>
            {/* Body */}
            <div className=" rounded-lg bg-white p-[32px] shadow-lg">
                <h2 className="text-[22px] font-bold ">{jobData?.jobTitle}</h2>
                
                <form className="bg-white  pt-6 pb-3 mb-4" onSubmit={handleSubmit}> 
                    {/* Input với label */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            value={name}
                            onChange={handleInputNameChange}
                            className={`peer block w-full border ${nameError ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 pt-6 pb-2 focus:outline-[4px] focus:outline-green-200 focus:outline focus:outline-solid`}
                            placeholder=" "
                        />
                        <label className="absolute top-0 left-3 px-1 my-2 text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-3 peer-focus:top-0 peer-focus:left-3  text-sm">
                            {"Your name"}
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                    </div>
                    

                    {/* Selection với radio và nút upload file */}
                    <div className="mb-4">
                        <label className="block text-lg font-bold mb-2">
                            Your CV <span className="text-red-500">*</span>
                        </label>
                        
                        <div className={`mb-4 p-4 border border-gray-300 rounded-lg ${cvOption === 'current' ? 'border-red-500 bg-red-100 bg-opacity-50' : 'border-gray-300'}`}>
                            <label className="inline-flex items-center">
                                <input
                                type="radio"
                                name="cvOption"
                                value="current"
                                checked={cvOption === 'current'}
                                onChange={() => setCvOption('current')}
                                className="form-radio text-red-500 w-6 h-6 cursor-pointer  "
                                />
                                <span className="ml-2 text-gray-700 cursor-pointer ">Use your current CV</span>
                            </label>
                            <div className="ml-4 p-2 text-blue-700 flex items-center">

                                <a
                                    className="no-underline"
                                    target="_blank"
                                    href={currentCV?.url}
                                >
                                    {" "}
                                    {currentCV?.fileName}{" "}
                                </a>
                                <Eye className="ml-2"/>
                            </div>
                        </div>
                        <div className={`mt-4 p-4 border border-gray-300 rounded-lg ${cvOption === 'new' ? 'border-red-500 bg-red-100 bg-opacity-50' : 'border-gray-300'}`}>
                            <label className="inline-flex items-center">
                                <input
                                type="radio"
                                name="cvOption"
                                value="new"
                                checked={cvOption === 'new'}
                                onChange={() => setCvOption('new')}
                                className="form-radio text-red-500 w-6 h-6 cursor-pointer"
                                />
                                <span className="ml-2 text-gray-700 cursor-pointer">Upload new CV</span>
                            </label>
                        
                            <div className="ml-6 mt-2">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="mt-2 block text-md text-gray-700  cursor-pointer focus:outline-none"
                            />
                            { cvOption === 'new' && !newFileUrl && <p className="mt-2 text-sm text-red-500"> Can not be blank</p>}
                            <p className="mt-1 text-sm text-gray-500">We accept .doc, .docx, .pdf files, no password protected, up to 3MB</p>
                            </div>
                        
                        </div>
                    </div>

                  {/* Input với nội dung từ 500 từ */}
                  <div className="mb-4">
                    <label className="block mb-3 ">
                      <span className="text-lg font-bold  "> Cover Leter</span>
                      <span className="text-gray-400 "> (Optional)</span>
                    </label>
                    <div className="my-2">
                      What skills, work projects or achievements make you a
                      strong candidate?
                    </div>
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-[4px]  focus:outline-green-200 focus:outline focus:outline-solid"
                      rows="6"
                      maxLength={"500"}
                      placeholder="Details and specific examples will make your application stronger..."
                      value={coverLetter}
                      onChange={handleCoverLetterChange}
                    ></textarea>
                    <div className=" text-gray-400">
                      {500 - coverLetter.length} of 500 characters remaining
                    </div>
                  </div>

                    {/* Button gửi form */}
                    <div className="flex items-center justify-center mt-6">
                        <button
                            className="bg-[#ED1B2F] hover:bg-red-600 text-white w-full font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Send my CV
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default FormApplyJob;

