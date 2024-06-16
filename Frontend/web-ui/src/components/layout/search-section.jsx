import { Link } from "react-router-dom";

// Components
import Container from "@/components/layout/container";
import SearchBar from "./search-bar";
import { Badge } from "@/components/ui/badge";

const trendingNow = [
    "Java",
    "ReactJS",
    ".NET",
    "Tester",
    "PHP",
    "Business Analyst",
    "NodeJS",
    "Manager",
];

const SearchSection = () => {
    return (
        <div className="bg-linear-gradient py-16 pt-36">
            <Container>
                <h1 className="text-2xl font-bold text-background">
                    1,031 IT Jobs For &quot;Chất&quot; Developers
                </h1>

                <SearchBar />

                <div className="mt-8 flex flex-wrap items-center space-x-4">
                    <h1 className="text-lg text-background">Trending now:</h1>

                    {trendingNow.map((item, index) => (
                        <Link
                            key={index}
                            to={`/search?keyword=${item}&city=all%20cities`}
                        >
                            <Badge
                                variant="outline"
                                className="border-muted-foreground text-base font-normal text-background"
                            >
                                {item}
                            </Badge>
                        </Link>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default SearchSection;
