import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-toastify";

// firebase
import { db } from "@/firebase/firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";
import {
    StoreRecentViewedJob,
    StoreSavedJob,
    CheckIsSavedJob,
} from "../Employee/employee-job-management";

// Components
import Container from "@/components/layout/container";
import SearchBar from "@/components/layout/search-bar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JobDetail from "@/components/Search/job-detail";
import FilterForm from "./filter";

// Icons
import { CircleDollarSign, MapPin, Laptop, Filter } from "lucide-react";

const cities = [
    { value: "all cities", label: "Vietnam" },
    { value: "ho chi minh", label: "Ho Chi Minh" },
    { value: "ha noi", label: "Ha Noi" },
    { value: "da nang", label: "Da Nang" },
    { value: "others", label: "Others" },
];
const requestWithBody = async (body, options = {}) => {
    return new Promise((resolve, reject) => {
        const callback = function (response) {
            let str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                resolve(JSON.parse(str));
            });
        };

        const req = (options.protocol === 'https:' ? https : http).request(options, callback);
        req.on('error', (e) => {
            reject(e);
        });
        req.write(body);
        req.end();
    });
};
const toQueryString = (params) => {
    return Object.keys(params)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
};
const transformData = (data) => {
    return {
        id: data.jobId, // Bạn có thể thay đổi ID này theo nhu cầu của bạn
        title: data.jobTitle,
        company: {
            name: data.employerInfo.companyName,
            type: data.employerInfo.companyType,
            size: data.employerInfo.companySize
        },
        working_model: data.jobType,
        location: data.jobLocation,
        // level: "Mid/Senior",  Bạn có thể thêm logic để xác định cấp bậc nếu cần
        skills: data.jobSkills.split(','),
        salary: data.jobSalary,
        description: data.jobDescription,
        country: data.employerInfo.country,
        working_days: data.employerInfo.workingDays,
        overtime_policy: data.employerInfo.overtimePolicy,
        posted_day: data.postedAt, // Bạn có thể thay đổi ngày này theo nhu cầu của bạn
        expired_day: "2024-05-03" // Bạn có thể thay đổi ngày này theo nhu cầu của bạn
    };
};

const SearchResult = () => {
    const [searchParams] = useSearchParams();

    const city = searchParams.get("city");
    const city_label = cities.find((c) => c.value === city)?.label;
    const keyword = searchParams.get("keyword").toLowerCase();

    const [jobs, setJobs] = useState([]);
    const [firstjobs, setFirstJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isFilterFormOpen, setisFilterFormOpen] = useState(false);

    // const [isSelectedJobSave, setIsSelectedJobSave] = useState(false);

    const { currentUser } = useAuth();

    const [filters, setFilters] = useState(null);

    const handleApplyFilters = (newFilters) => {
        console.log('Applied Filters:', newFilters);
        setSelectedJob(null)
        setFilters(newFilters);
        setisFilterFormOpen(false)
        // Apply filters to your data or state
    };

    const handleFilterForm = () => setisFilterFormOpen(true)
    /*
    const ApplyFiltersToJobs = () => {
        if (filters) {
            setJobs(firstjobs);
            firstjobs.filter((job)=>{
                console.log("Fisrt Job id: " + job.id);
            });
            jobs.filter((job)=>{
                console.log("Job id: " + job.id);
            });
            if (filters.selectedLevel) {
              //  console.log("Filter Level: " + filters.selectedLevel);
                const filterJobs = jobs.filter(job => {
              //      console.log("Job level: " + job.level);
                    return filters.selectedLevel.some(level => job.level.includes(level));
                });
              //  console.log("Filter Jobs: ", filterJobs);
                setJobs(filterJobs);
            }
            if (filters.selectedWorkingModel) {
              //  console.log("Filter selectedWorkingModel: " + filters.selectedWorkingModel);
                const filterJobs = jobs.filter(job => {
              //      console.log("Job Working Model: " + job.working_model);
                    return filters.selectedWorkingModel.some(workingModel => job.working_model.includes(workingModel));
                });
              //  console.log("Filter Jobs: ", filterJobs);
                setJobs(filterJobs);
            }
           
        }

    };*/
    const ApplyFiltersToJobs = () => {
        if (!filters) {
            setJobs(firstjobs);
            return;
        }

        let filteredJobs = firstjobs;
        if ( filters.selectedLevel) {
            filteredJobs = firstjobs.filter(job =>
                job.level && filters.selectedLevel.some(level => job.level.includes(level))
            );
        }

        if ( filters.selectedWorkingModel) {
            filteredJobs = firstjobs.filter(job =>
                filters.selectedWorkingModel.some(workingModel => job.working_model.includes(workingModel))
            );
        }

        setJobs(filteredJobs);
    };
    useEffect(() => {
        ApplyFiltersToJobs();
    }, [filters]);
    const handleResetFilters = () => {
        console.log('Filters reset');
        setFilters(null);
        // Reset filters in your data or state
    };

    // orignal useEffect
    // useEffect(() => {
    //     fetch("https://demo-restful-api-itviec.vercel.app/api/jobs")
    //         .then((response) => response.json())
    //         .then((data) => {
    //             // Filter jobs by city and keyword
    //             if (city !== "all") {
    //                 data = data.filter((job) =>
    //                     job.location.toLowerCase().includes(city),
    //                 );
    //             }
    //             if (keyword) {
    //                 data = data.filter((job) =>
    //                     job.title.toLowerCase().includes(keyword),
    //                 );
    //             }
    //             // data = data.map((job) => {console.log(job)})

    //             setJobs(data);
    //             if (!selectedJob && data.length > 0) setSelectedJob(data[0]);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // });

    // useEffect() with adding saveJob atrribute to every job in the jobs list
    useEffect(() => {
        const fetchJobs = async (keyword, city) => {
            try {
                const searchRequest = {
                    query: keyword,
                    jobLocation: city
                };
                const queryString = toQueryString(searchRequest);

                console.log("Search Request:" + queryString);
                // Get Jobs from API: https://demo-restful-api-itviec.vercel.app/api/jobs
                // console.log(JSON.stringify(searchRequest));
                const response = await fetch(
                    `https://job-search-service.azurewebsites.net/job-elastic/search`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(searchRequest)
                }

                );
                //const response = await requestWithBody(body,option);
                const responseData = await response.json();
                /*
                const response = [{"jobId":"c85a01bc-f40c-4673-8fbe-4632fb4f3892","creatorId":"PRIVATE","jobStatus":"approved","employerId":"37619493-fea7-4ed5-ad95-2a75b3dbb624","jobSalary":"10000$","jobTitle":"Team leader","jobLocation":"100 Xuan Thuy Street, Thao Dien Ward, Thu Duc City, Ho Chi Minh","jobType":"Hybrid","postedAt":"13 hours ago","jobSkills":"Java,SQL,C#","jobTopReasons":"Global Company- Develop Your Career & English\nCompetitive Salary, and company profit share\nOnsite opportunities","jobDescription":"<p>About The Role Exciting opportunity for an enthusiastic Java Software Developer with at least 4 years of experience to join our CIS-P Team in Ho Chi Minh City. Take a key role in driving success as you collaborate with our team to provide enterprise CRM solutions to the utilities sector with key customers in Australia, Ireland, the USA and Japan. About You You are an enthusiastic individual with proven experience and strong Java knowledge of J2EE, design patterns, core libraries and frameworks such as Spring, Hibernate and Java messaging frameworks. You possess a curious nature and thrive in diverse technical environments, where your skills in SQL, exposure to DevOps, and experience working in Linux environments are highly valued. You have good command of English and Vietnamese communication with eagerness to work with complicated business requirements, and implementation to technical specifications.</p>","jobResponsibility":"<p>Design, code, and test software as part of the Agile team Update status and technical documents in Jira Troubleshoot and escalate issues Participate in R&amp;D program where we are using Docker, Kafka, Kubernetes</p>","jobRequirement":"<p>Have strong Java knowledge: Java or Java EE (certified). Good English and Vietnamese communication. Knowledge of typical patterns, core libraries and frameworks. Object-Oriented Analysis, Design, and Implementation skills. Have solid SQL Knowledge. Have exposure to DevOps aspects including Bash Script and Perl on Linux. Have good skills in Enterprise Java, including: Spring and Hibernate. Java messaging (e.g., ActiveMQ). Are experienced and comfortable with: Eclipse as the main IDE. Working in an Agile environment (we use JIRA). Has actual experience working with Linux (e.g., Working daily on Linux as the main development environment).</p>","jobBenefit":"Competitive Market Rate Salary - full salary (including SI contribution) during the probation period and 13th-month salary\\nTwice yearly salary review\\nFull participation in the annual Hansen Profit Share Program\\nGreat Leave Options – including 12 days annual leave during Year 1, increasing to 15 days annual leave and 12 days paid sick leave per year).\\nPremium healthcare for employee and dependents (spouse and {all} children and support for parents). Also, free comprehensive annual check-up for employees.","employerInfo":{"companyName":"YAN Corp","companyType":"Product","companySize":"1-20","country":"Việt Nam","workingDays":"Monday - Friday","overtimePolicy":"Yes","companyOverview":"Global","keySkills":"JS,Java,Python","whyLoveWorkingHere":"Innovative culture and cutting-edge projects /n Innovative culture and cutting-edge projects","logoUrl":"https://employer-service-otwul2bnna-uc.a.run.app/uploads/36f2001f-aebd-445d-9b6a-987d9f12f7b1.jpg","location":"TP Hồ Chí Minh","workType":"Remote","image":"https://employer-service-otwul2bnna-uc.a.run.app/uploads/f9876d12-0654-4aff-97e6-c01c231a83ef.jpeg"}}]
                const responseData = response;*/
                console.log("Response Data");
                console.log(responseData);
                // Sử dụng map để chuyển đổi dữ liệu
                let data = responseData.map(item => transformData(item)); ///await response.json();
                console.log("Map Data");
                console.log(data);
                /*
                // Filter jobs by city and keyword
                if (city !== "all cities") {
                    data = data.filter((job) =>
                        job.location.toLowerCase().includes(city),
                    );
                }
                if (keyword) {
                    data = data.filter((job) =>
                        job.title.toLowerCase().includes(keyword),
                    );
                }*/

                // Add isSaved attribute to jobs
                const updatedData = await addIsSavedAttribute(
                    data,
                    currentUser,
                );
                console.log("Update Data");
                console.log(updatedData);
                setJobs(updatedData);
                setFirstJobs(updatedData);
                if (!selectedJob && updatedData.length > 0)
                    setSelectedJob(updatedData[0]);
            } catch (error) {
                console.error(error);
            }
        };

        fetchJobs(keyword, city);
    }, [city, keyword, currentUser]);
    const addIsSavedAttribute = async (jobs, currentUser) => {
        try {
            const jobsWithIsSaved = await Promise.all(
                jobs.map(async (job) => {
                    const isSaved = await CheckIsSavedJob(job, currentUser);
                    return { ...job, isSaved };
                }),
            );
            return jobsWithIsSaved;
        } catch (error) {
            console.error("Error adding isSaved attribute to jobs:", error);
            return jobs;
        }
    };

    const handleListItemClick = (id) => {
        let recentJob = jobs.find((job) => job.id === id);
        StoreRecentViewedJob(recentJob, currentUser);
        setSelectedJob(jobs.find((job) => job.id === id));
    };

    const selectedJobClassName =
        // The red ring around the selected card
        "relative ring-1 ring-inset ring-primary" +
        // The red line on the left side of the selected card
        " before:absolute before:left-0 before:top-[8px] before:h-[calc(100%-16px)] before:w-1.5 before:rounded-r-lg before:bg-primary before:content-['']" +
        // The red triangle on the right side of the selected card
        " after:absolute after:left-full after:top-1/2 after:h-0 after:w-0 after:border-b-[10px] after:border-l-[10px] after:border-t-[10px] after:border-b-transparent after:border-l-primary after:border-t-transparent after:content-['']";

    return (
        <>
            <div className="bg-linear-gradient py-8">
                <Container>
                    <SearchBar inputCity={city} inputQuery={keyword} />
                </Container>
            </div>

            <div className="bg-gray-100 py-8">
                <Container>
                    {/* "Total jobs" & "filter button" container */}
                    <div className="flex justify-between pb-8">
                        {/* Total jobs headline */}
                        <h1 className="text-3xl font-bold text-foreground">
                            {jobs.length}{" "}
                            <span className={keyword && "text-primary"}>
                                {keyword || "IT"}
                            </span>{" "}
                            {jobs.length == 1 ? "job" : "jobs"} in {city_label}
                        </h1>

                        {/* Filter button */}
                       
                        <Dialog>
                            <DialogTrigger>
                                <Button
                                    onClick = {handleFilterForm}
                                    variant="outline"
                                    className="hover:text- border-primary bg-none font-bold text-primary"
                                >
                                    <Filter className="mr-2" />
                                    Filter
                                </Button>
                            </DialogTrigger>
                            {isFilterFormOpen ? (
                            <DialogContent className="w-full">
                                <DialogHeader >
                                    <DialogTitle>
                                        <div>Filter</div>
                                        <hr></hr>
                                    </DialogTitle>
                                </DialogHeader>
                                
                                <FilterForm onApply={handleApplyFilters} onReset={handleResetFilters} />
                                    
                            </DialogContent>): ("")}
                        </Dialog>
                    </div>

                    {/* "Job list" & "job detail" container */}
                    <div className="grid grid-cols-10 gap-4">
                        {/* Job list */}
                        <div className="col-span-4">
                            <ul className="space-y-4">
                                {jobs.map((job) => (
                                    <li
                                        key={job.id}
                                        onClick={() =>
                                            handleListItemClick(job.id)
                                        }
                                    >
                                        {selectedJob != null ? (
                                        <Card
                                            // Conditional styling for the selected card
                                            className={
                                                selectedJob.id === job.id &&
                                                selectedJobClassName
                                            }
                                        >
                                            <CardHeader>
                                                {/* Posted date */}
                                                <p className="text-sm text-gray-500">
                                                    Posted on {job.posted_day}
                                                </p>

                                                {/* Job title */}
                                                <CardTitle>
                                                    <Link
                                                        to={`/job-detail/${job.id}`}
                                                    >
                                                        {job.title}
                                                    </Link>
                                                </CardTitle>

                                                {/* Company name */}
                                                <p className="text-base">
                                                    {job.company?.name}
                                                </p>

                                                {/* Salary */}
                                                <p className="flex space-x-3 text-green-600">
                                                    <CircleDollarSign />
                                                    <div>{job.salary}</div>
                                                </p>
                                            </CardHeader>

                                            <hr className="mx-6 mb-6 border-dashed" />

                                            <CardContent>
                                                <CardDescription className="flex items-center space-x-2">
                                                    <Laptop className="h-5 w-5" />

                                                    <p className="text-foreground">
                                                        {job.working_model}
                                                    </p>
                                                </CardDescription>

                                                <CardDescription className="flex items-center space-x-2">
                                                    <MapPin className="h-5 w-5" />

                                                    <p className="text-foreground">
                                                        {job.location}
                                                    </p>
                                                </CardDescription>

                                                {/* Skills section */}
                                                <div className="space-x-1 space-y-1 pt-2">
                                                    {job.skills.map((skill) => (
                                                        <Badge
                                                            key={skill}
                                                            variant="outline"
                                                            className="text-sm font-normal"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>) : ("")}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Job detail */}
                        <div className="col-span-6">
                            {selectedJob ? (
                                <JobDetail job={selectedJob} />
                            ) : (
                                <div>No job selected</div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
};

SearchResult.propTypes = {
    city: PropTypes.string,
    query: PropTypes.string,
};

export default SearchResult;
