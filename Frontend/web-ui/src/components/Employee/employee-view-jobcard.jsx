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
import { CircleDollarSign, MapPin, Laptop, Filter } from "lucide-react";

const EmployeeViewJobCard = ({jobs,location}) => {

    const isRender = (job,location) => {
        if (location !="job-saved")
            return true
        
        if (job.isSaved == null)
            return true;
        else return job.isSaved
    }
    return (
<div className="bg-gray-200">
    <ul className="grid grid-cols-4 gap-4">
        {jobs.map((job) => (
            isRender(job,location) ? 
            (<li
                key={job.id}
                onClick={() =>
                    handleListItemClick(job.id)
                }
            >
                <Card
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
                </Card>
            </li>) : ("")
        ))}
    </ul>
</div>
    );
};

export default EmployeeViewJobCard;