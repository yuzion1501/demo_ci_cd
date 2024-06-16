import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../contexts/authContext";
import { Link } from "react-router-dom";
// firebase
import { db } from "@/firebase/firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";
import {
    StoreRecentViewedJob,
    StoreSavedJob,
    CheckIsSavedJob,
} from "../Employee/employee-job-management";

// Components
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import { CircleDollarSign, Heart, MapPin, Laptop, Clock } from "lucide-react";

const JobDetail = ({ job }) => {
    const { currentUser } = useAuth();
    const [reload, setReload] = useState(0);
    // const [isLike, setisLike] = useState(false); => use job.isSaved props instead of use isLike with useState


    const handleLiked = () => {
        job.isSaved = !job.isSaved;
        StoreSavedJob(job, currentUser, job.isSaved);
        // use setReload to reload this component after user like the job
        setReload(reload + 1);
    };

    if (!job) {
        return null;
    }

    return (
        <Card className="sticky top-[76px]">
            <CardHeader>
                {/* "Company logo", "job title", "company name", & "salary" container */}
                <div className="flex items-center space-x-4">
                    <img
                        src="https://placehold.co/300"
                        alt="Company logo"
                        className="aspect-square rounded-lg object-contain sm:w-24"
                    />

                    <div className="space-y-1">
                        <CardTitle>{job.title ?? ""}</CardTitle>

                        <p className="text-lg">{job.company?.name ?? ""}</p>

                        <p className="flex items-center space-x-3 text-base text-green-600">
                            <CircleDollarSign />

                            <div>{job.salary}</div>
                        </p>
                    </div>
                </div>

                {/* Action buttons container */}
                <div className="flex space-x-2 pt-3">
                    <Button className="flex-1">
                        <Link to={`/form-apply-job/${job.id}`} className="button-link flex-1">
                            Apply now
                        </Link>

                    </Button>

                    <Button
                        variant="icon"
                        className="text-primary"
                        onClick={handleLiked}
                    >
                        {/* <Heart className={isLiked && "fill-current"} /> */}
                        <Heart
                            className={
                                job.isSaved != null && job.isSaved
                                    ? "fill-current"
                                    : ""
                            }
                        />
                    </Button>
                </div>
            </CardHeader>

            <hr className="mx-6 mb-6" />

            <ScrollArea className="h-[calc(100vh - 16px)]">
                <CardContent>
                    {/* Section 1 */}
                    <div className="space-y-2">
                        <CardDescription className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5" />

                            <p className="text-foreground">{job.location}</p>
                        </CardDescription>

                        <CardDescription className="flex items-center space-x-2">
                            <Laptop className="h-5 w-5" />

                            <p className="text-foreground">
                                {job.working_model}
                            </p>
                        </CardDescription>

                        <CardDescription className="flex items-center space-x-2">
                            <Clock className="h-5 w-5" />

                            <p className="text-foreground">{job.posted_day}</p>
                        </CardDescription>

                        <div className="flex space-x-2">
                            <span className="mr-3">Skills:</span>

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
                    </div>

                    <hr className="my-6 border-dashed" />

                    {/* Section 2 */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Top 3 reasons to join us
                        </h1>

                        <ul className="list-inside list-disc">
                            <li>
                                Attractive salary package and valuable benefits
                            </li>
                            <li>
                                Get the opportunity to access global L&D
                                programs
                            </li>
                            <li>Hybrid and flexible working environment</li>
                        </ul>
                    </div>

                    <hr className="my-6 border-dashed" />

                    {/* Section 3 */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Job description</h1>


                        {job.description}

                    </div>
                </CardContent>
            </ScrollArea>
        </Card>
    );
};

JobDetail.propTypes = {
    job: PropTypes.object,
};

export default JobDetail;
