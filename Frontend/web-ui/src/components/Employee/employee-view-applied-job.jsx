import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JobDetail from "@/components/Search/job-detail";

// Icons
import { CircleDollarSign, MapPin, Laptop, Filter, Check} from "lucide-react";

const EmployeeViewAppliedJob = ({jobs}) => {

    return (
<div className="bg-gray-200">
    <ul className="grid grid-cols-4 gap-4">
        {jobs.map((job) => (
            <li
                key={job.jobId}
                onClick={() =>
                    handleListItemClick(job.jobId)
                }
            >
                <Card
                >
                    <CardHeader>
                        {/* Posted date */}
                        <p className="text-sm text-gray-500">
                            Posted on {job.postedAt}
                        </p>

                        {/* Job title */}
                        <CardTitle>
                            <Link
                                to={`/job-detail/${job.jobId}`}
                            >
                                {job.jobTitle}
                            </Link>
                        </CardTitle>

                        {/* Company name */}
                        <p className="text-base">
                            {job.employerInfo?.companyName}
                        </p>

                        {/* Salary */}
                        <p className="flex space-x-3 text-green-600">
                            <CircleDollarSign />
                            <div>{job.jobSalary}</div>
                        </p>
                    </CardHeader>

                    <hr className="mx-6 mb-6 border-dashed" />

                    <CardContent>
                        <CardDescription className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />
                            <p className="text-foreground">
                                {job.jobLocation}
                            </p>
                        </CardDescription>

                        <CardDescription className="mt-5 flex items-center space-x-2">
                            <Check className="h-5 w-5 stroke-green-500" />

                            <p className="text-foreground">
                                {job.jobStatus}
                            </p>
                        </CardDescription>

                        {/* Skills section */}
                        <div className="space-x-1 space-y-1 pt-2">
                            {/* {job.jobSkills.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-sm font-normal"
                                >
                                    {skill}
                                </Badge>
                            ))} */}
                        </div>
                    </CardContent>
                </Card>
            </li>
        ))}
    </ul>
</div>
    );
};

export default EmployeeViewAppliedJob;