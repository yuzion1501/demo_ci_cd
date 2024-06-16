import { Link } from "react-router-dom";

// Components
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Assets
import CardBackgroundSVG from "@/assets/bg-top-emp.svg";
import { ChevronRight } from "lucide-react";

const EmployerCard = ({ employer }) => {
    const { employerId, companyName, logoUrl, keySkills, location } = employer;
    const skills = keySkills?.split(",");

    return (
        <Link to={`/companies?id=${employerId}`}>
            <Card className="relative flex h-full cursor-pointer flex-col justify-between bg-muted/20">
                <div className="absolute">
                    <img src={CardBackgroundSVG} alt="Footer image" />
                </div>

                <CardContent className="px-28 pt-10">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-xl">
                        <img
                            src={logoUrl || "https://placehold.co/300"}
                            alt={companyName}
                            className="aspect-square w-full object-contain"
                        />
                    </div>
                </CardContent>

                <CardContent>
                    <div className="flex flex-col items-center space-y-2">
                        <p className="line-clamp-3 text-lg font-semibold">
                            {companyName}
                        </p>

                        {skills && (
                            <div className="flex flex-wrap space-x-2 pt-2">
                                {skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-sm font-normal"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between bg-muted py-5">
                    <h1 className="text-sm">{location || "TP Hồ Chí Minh"}</h1>

                    {/* TODO: Add number of available jobs later */}
                    <Button
                        variant="link"
                        size="sm"
                        className="h-min p-0 text-foreground hover:no-underline"
                    >
                        175 Jobs <ChevronRight />
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
};

export default EmployerCard;
