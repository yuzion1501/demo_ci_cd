import React from "react";
import { Link } from "react-router-dom";

// Components
import Container from "@/components/layout/container";
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Assets
import UserProfileSVG from "@/assets/user-profile.svg";
import CVTemplateSVG from "@/assets/cv-template.svg";

const UserProFileSection = () => {
    return (
        <div className="bg-muted py-16 text-center">
            <Container>
                <h1 className="pb-8 text-2xl font-bold text-foreground">
                    Best tools for your application journey
                </h1>

                <div className="flex justify-center space-x-4">
                    <Card className="w-1/3 border-none shadow-md">
                        <CardHeader className="my-2 flex flex-row items-start space-x-4">
                            <img src={UserProfileSVG} alt="User profile icon" />

                            <div className="space-y-2 text-left">
                                <CardTitle>User Profile</CardTitle>

                                <p className="pb-4">
                                    Create an excellent profile with a
                                    well-structured format and specific guide
                                </p>

                                <Link to="/profile-cv">
                                    <Button>Update profile</Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="w-1/3 border-none shadow-md">
                        <CardHeader className="my-2 flex flex-row items-start space-x-4">
                            <img src={CVTemplateSVG} alt="CV icon" />

                            <div className="space-y-2 text-left">
                                <CardTitle>Manage CVs</CardTitle>

                                <p className="pb-4">
                                    Create an excellent profile with a
                                    well-structured format and specific guide
                                </p>

                                <Link to="/profile-cv/manage-cv">
                                    <Button variant="outline">
                                        Manage CVs
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default UserProFileSection;
