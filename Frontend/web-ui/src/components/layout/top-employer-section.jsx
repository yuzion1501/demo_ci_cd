import { useEffect, useState } from "react";

// Components
import Container from "@/components/layout/container";
import EmployerCard from "@/components/employer-card";

const TopEmployerSection = () => {
    const [employers, setEmployers] = useState([]);

    useEffect(() => {
        const fetchTopEmployers = async () => {
            try {
                const response = await fetch(
                    "https://employer-service-otwul2bnna-uc.a.run.app/employer/get-top",
                );
                let data = await response.json();

                setEmployers(data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTopEmployers();
    }, []);

    return (
        <Container className="py-16 text-center">
            <h1 className="pb-16 text-2xl font-bold text-foreground">
                Top Employers
            </h1>

            {employers.length === 0 ? (
                <p>Fetching Top Employers...</p>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {employers.map((employer, index) => (
                        <EmployerCard key={index} employer={employer} />
                    ))}
                </div>
            )}
        </Container>
    );
};

export default TopEmployerSection;
