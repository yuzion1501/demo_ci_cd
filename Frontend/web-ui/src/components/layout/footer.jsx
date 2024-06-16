import { Link } from "react-router-dom";

// Components
import { Separator } from "@/components/ui/separator";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";

// Assets
import Logo from "../../assets/logo-fitviec.webp";
import FooterImg from "../../assets/footer-image.svg";
import {
    Linkedin,
    Facebook,
    Youtube,
    PhoneCall,
    Mail,
    Send,
} from "lucide-react";

const aboutUsHeadings = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/" },
    { title: "AI Match Service", link: "/" },
    { title: "Contact Us", link: "/" },
    { title: "All Jobs", link: "/" },
    { title: "FAQ", link: "/" },
];
const yourCareerHeadings = [
    { title: "Profile CV", link: "/profile-cv" },
    { title: "Manage CVs", link: "/profile-cv/manage-cv" },
    { title: "Saved Jobs", link: "/my-jobs" },
    { title: "Applied Jobs", link: "/my-jobs/applied" },
];
const termHeadings = [
    { title: "Privacy Policy", link: "/" },
    { title: "Complaint Handling", link: "/" },
    { title: "Operating Regulation", link: "/" },
    { title: "Terms & Conditions", link: "/" },
];

const Footer = () => {
    return (
        <footer className="relative mt-auto bg-linear-gradient text-sm">
            <div className="absolute bottom-0 right-0 -z-10">
                <img src={FooterImg} alt="Footer image" />
            </div>

            <Container className="flex flex-wrap pt-12">
                <div className="w-1/5">
                    <img src={Logo} alt="Logo" className="h-[50px]" />
                    <h1 className="text-background">Ít nhưng mà chất</h1>

                    <div className="mt-5 space-x-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full border-muted-foreground bg-transparent text-muted-foreground"
                        >
                            <Linkedin />
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full border-muted-foreground bg-transparent text-muted-foreground"
                        >
                            <Facebook />
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full border-muted-foreground bg-transparent text-muted-foreground"
                        >
                            <Youtube />
                        </Button>
                    </div>
                </div>

                <div className="w-1/5">
                    <h1 className="text-base font-medium text-background">
                        About Us
                    </h1>

                    <ul className="mt-2 space-y-2 text-muted-foreground">
                        {aboutUsHeadings.map((heading, index) => (
                            <li key={index}>
                                <Link to={heading.link}>{heading.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-1/5">
                    <h1 className="text-base font-medium text-background">
                        Your Career
                    </h1>

                    <ul className="mt-2 space-y-2 text-muted-foreground">
                        {yourCareerHeadings.map((heading, index) => (
                            <li key={index}>
                                <Link to={heading.link}>{heading.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-1/5">
                    <h1 className="text-base font-medium text-background">
                        Terms & Conditions
                    </h1>

                    <ul className="mt-2 space-y-2 text-muted-foreground">
                        {termHeadings.map((heading, index) => (
                            <li key={index}>
                                <Link to={heading.link}>{heading.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-1/5">
                    <h1 className="text-base font-medium text-background">
                        Want to post a job? Contact us:
                    </h1>

                    <ul className="mt-2 space-y-2 text-muted-foreground">
                        <li>
                            <PhoneCall className="mr-2 inline" />
                            (+84) 123 345 567
                        </li>

                        <li>
                            <Mail className="mr-2 inline" />
                            Email: fitviec@gmail.com
                        </li>

                        <li>
                            <Send className="mr-2 inline" />
                            Submit contact information
                        </li>
                    </ul>
                </div>
            </Container>

            <Separator className="mt-12 bg-muted-foreground" />

            <Container>
                <h3 className="py-3 text-center text-xs text-muted-foreground">
                    &copy; 2024 FIT VIEC - HCMUS
                </h3>
            </Container>
        </footer>
    );
};

export default Footer;
