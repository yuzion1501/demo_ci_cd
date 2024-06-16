import React from "react";
import Container from "@/components/layout/container";
import { useNavigate } from "react-router-dom";

const HomeEmployer = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <div className="grow">
                <div>
                    {/* Banner */}
                    <section className="bg-linear-gradient ">
                        <Container className="py-16 pt-8">
                            <div className="mx-auto flex flex-col items-center px-1 py-16 lg:flex-row-reverse lg:py-20">
                                <div className="flex-1 lg:pl-20">
                                    <img
                                        alt="hire-the-best-it"
                                        className="w-full"
                                        src="/hire-the-best-it.webp"
                                    />
                                </div>
                                <div className="flex-1 text-center text-white lg:text-left">
                                    <div className="lg:pl-5 ">
                                        <h1 className="mt-8 text-xl font-bold leading-10 lg:text-3xl">
                                            Hire the best IT Professionals in
                                            Vietnam with FITviec
                                        </h1>
                                        <p className="mb-12 mt-6 text-lg leading-8">
                                            With in-depth understanding in the
                                            IT sector and specialized skills, we
                                            can help you reach and hire the best
                                            IT candidates.
                                        </p>
                                        <button
                                            className="mb-6 flex h-12 w-52 items-center justify-center gap-0 rounded-sm  bg-red-600 py-2 font-bold text-white hover:bg-red-800"
                                            onClick={() =>
                                                navigate("/customer/register")
                                            }
                                        >
                                            Register Employer
                                        </button>
                                        <div className="mt-8 flex flex-col items-center lg:flex-row">
                                            <p className="mb-2 text-gray-300 lg:mb-0 lg:mr-1">
                                                Already have an Employer
                                                account?
                                            </p>
                                            <a
                                                className="text-white underline"
                                                target="_blank"
                                                href="/customer/login"
                                            >
                                                Login
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                    {/* Different */}
                    <section className="mt-2 bg-linear-gradient-different px-5 pt-10 lg:px-0 lg:pt-12">
                        <Container className="py-16 pt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold lg:text-3xl">
                                    What makes FITviec different?
                                </div>
                                <p className="mb-6  mt-5 text-base ">
                                    FITviec is the top recruiting site and
                                    database for IT Professionals in Vietnam.
                                </p>
                            </div>
                            <div className="lg:pt-22 lg:pb-30 flex flex-col items-center justify-center gap-8 bg-itviec-different bg-bottom bg-no-repeat pb-24 pt-20 lg:flex-row lg:bg-center-center lg:px-5">
                                <div className="relative mt-4 flex flex-col items-center justify-center rounded-lg border-0 bg-white px-14 py-10 shadow-xl lg:mt-0">
                                    <p className="text-4xl font-bold text-red-600">
                                        10,000+
                                    </p>
                                    <p className="mt-2 text-lg">
                                        IT Companies & Enterprises
                                    </p>
                                    <img
                                        alt="first-hand"
                                        className="absolute -top-10"
                                        src="https://itviec.com/assets/employer_landing/first-hand-8f9978db44dfb1095793ff239fa072e94bfd1d74d7b62a875d7f69eba997b911.svg"
                                    />
                                </div>
                                <div className="relative mt-4 flex flex-col items-center justify-center rounded-lg border-0 bg-white px-14 py-10 shadow-xl lg:mt-0">
                                    <p className="text-4xl font-bold text-red-600">
                                        1,500,000+
                                    </p>
                                    <p className="mt-2 text-lg">CVs sent</p>
                                    <img
                                        alt="second-hand"
                                        className="absolute -top-10"
                                        src="https://itviec.com/assets/employer_landing/second-hand-ef88cbd609f610ad98826b198a83feb349b8896a396f114c31721640592f6698.svg"
                                    />
                                </div>
                                <div className="relative mt-4 flex flex-col items-center justify-center rounded-lg bg-white px-14 py-10 shadow-xl lg:mt-0">
                                    <p className="text-4xl font-bold text-red-600">
                                        300,000+
                                    </p>
                                    <p className="mt-2 text-lg">
                                        Highly-experienced IT Profiles matched
                                    </p>
                                    <img
                                        alt="third-hand"
                                        className="absolute -top-10"
                                        src="https://itviec.com/assets/employer_landing/third-hand-4285467762b4dd431d96729f58e05928f8b304f711ce0d683660648ebd294f36.svg"
                                    />
                                </div>
                            </div>
                        </Container>
                    </section>
                    {/* Hight-value-services */}
                    <section className="bg-linear-gradient-hight-value">
                        <Container className="py-16 pt-8">
                            <div className="mt-12 text-center text-2xl font-bold text-white lg:text-3xl">
                                High-value services for IT Employers
                            </div>
                            <div className="mt-4 flex flex-col items-center justify-between rounded-lg bg-white px-6 py-6 lg:mt-12 lg:flex-row lg:px-12 lg:py-12">
                                <div className="flex flex-col items-center bg-white  lg:flex-row-reverse ">
                                    <div className="flex justify-center lg:w-1/2">
                                        <img
                                            className="w-full lg:max-w-md"
                                            src="https://itviec.com/assets/employer_landing/job-posting-15-30ceaa97f37fd97afb7dabc2c5ef6fe5702b78faf0c3da8aedb5d7d64b274a54.png"
                                        />
                                    </div>
                                    <div className="lg:w-1/2">
                                        <div className="py-4 text-2xl font-bold lg:py-0 lg:text-3xl">
                                            Job Posting
                                        </div>
                                        <p className="mt-4  text-base text-gray-700">
                                            Boost IT recruiting with our Tech
                                            and IT job platform. Manage top
                                            candidate CVs from FITviec with
                                            ease. Intuitive interface, prompt
                                            support, powerful tools.
                                        </p>
                                        <div className="mt-8 lg:flex">
                                            <div className="mb-4 flex w-full items-center bg-linear-gradient-content  p-5 lg:mb-0 lg:mr-4 lg:w-1/2">
                                                <img src="https://itviec.com/assets/employer_landing/opportunities-a53edbeb973cfeaa459e920b7a4562354aa02a1c83a53150cf8ebf17aaa7ce57.svg" />
                                                <p className="ml-4 mt-4 text-sm lg:mt-0 ">
                                                    Better opportunities to
                                                    approach top IT candidates
                                                    from FITviec
                                                </p>
                                            </div>
                                            <div className="flex w-full items-center bg-linear-gradient-content p-5 lg:w-1/2">
                                                <img src="https://itviec.com/assets/employer_landing/right-skill-be1892ff9d11b80aeab90527abe6b19cfb855ab95fbcc9b7bc75c89184353bfd.svg" />
                                                <p className="ml-4 mt-4 text-sm lg:mt-0 ">
                                                    Attract the right candidates
                                                    by the right skills
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col items-center justify-between rounded-lg bg-white px-6 py-6 lg:mt-12 lg:flex-row lg:px-12 lg:py-12">
                                <div className="flex flex-col items-center bg-white  p-4 lg:flex-row-reverse ">
                                    <div className="flex justify-center lg:w-1/2">
                                        <img
                                            className="w-full lg:max-w-md"
                                            src="https://itviec.com/assets/employer_landing/employer-branding-15-9901407b309ba5b978b453490ba825d6e1c6c82c488649032f98840cd14eed04.png"
                                        />
                                    </div>
                                    <div className="lg:w-1/2">
                                        <div className="py-4 text-2xl font-bold lg:py-0 lg:text-3xl">
                                            Employer Branding
                                        </div>
                                        <p className="mt-4  text-base text-gray-700">
                                            Increase brand awareness, reach IT
                                            Professionals on FITviec through
                                            specialized touch points, and
                                            connect with top Vietnamese IT
                                            candidates.
                                        </p>
                                        <div className="mt-8 lg:flex lg:flex-col lg:gap-4">
                                            <div className="mb-4 flex w-full items-center bg-linear-gradient-content-x  p-5 lg:mb-0 lg:mr-4 ">
                                                <img src="https://itviec.com/assets/employer_landing/first-employer-branding-974416a3d60028453bad0cad115f6ab42ea0736b117aba05e0816b1d49caf93b.svg" />
                                                <p className="ml-4 mt-4 text-sm leading-6 lg:mt-0">
                                                    <span className="font-semibold">
                                                        Top Employers
                                                    </span>
                                                    <br />
                                                    Appear as outstanding &
                                                    leading IT companies in
                                                    Vietnam
                                                </p>
                                            </div>
                                            <div className="mb-4 flex w-full items-center bg-linear-gradient-content-x  p-5 lg:mb-0 lg:mr-4 ">
                                                <img src="https://itviec.com/assets/employer_landing/second-employer-branding-970e0278afc18f58c8c7952e73f33e2288e18f92cf9a7709d8fddccd5749bbe8.svg" />
                                                <p className="ml-4 mt-4 text-sm leading-6  lg:mt-0 ">
                                                    <span className="font-semibold">
                                                        Company Spotlight
                                                    </span>
                                                    <br />
                                                    Strengthen the employer
                                                    branding to top IT talents
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Button */}
                            <div className="mb-12 mt-8 lg:mt-12">
                                <h3 className="pb-5 text-center text-2xl text-white">
                                    Experience FITviec's service today
                                </h3>
                                <div className="flex justify-center">
                                    <button
                                        className="mb-6 flex h-12 w-52 items-center justify-center gap-0 rounded-sm  bg-red-600 py-2 font-bold text-white hover:bg-red-800"
                                        onClick={() =>
                                            navigate("/customer/register")
                                        }
                                    >
                                        Register Employer
                                    </button>
                                </div>
                            </div>
                        </Container>
                    </section>
                    {/* Top-Employer-container */}
                    <section className="mb-20 mt-2 bg-itviec-top-emp px-5 pt-12 lg:px-0 lg:pt-12">
                        <Container className="py-16 pt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold lg:text-3xl">
                                    Top Companies on FITviec
                                </div>
                                <p className="mb-12  mt-5 text-base ">
                                    Our Customers and Partners include
                                    well-known IT firms as well as innovative
                                    startups.
                                </p>
                            </div>
                            <div className="grid grid-flow-col grid-cols-8 grid-rows-2 gap-8">
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://inkythuatso.com/uploads/images/2021/12/logo-abbank-inkythuatso-07-15-01-34.jpg"
                                        alt="company1"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOVVIRFE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--1ae7acc317bfb2f261c8b580725af2d56ae34b7e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--15c3f2f3e11927673ae52b71712c1f66a7a1b7bd/money-forward-vi-t-nam-logo.png"
                                        alt="company2"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Bosch_logo.png"
                                        alt="company3"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Logo-Sacombank-new.png"
                                        alt="company4"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/600px-LG_logo_%282014%29.svg.png"
                                        alt="company5"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://upload.wikimedia.org/wikipedia/commons/e/ed/HRS_GROUP_Color_sRGB.png"
                                        alt="company6"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjOKq8yXU9PEZMWbyz7EnbgOg9EGmzvdA2K6qbk_SwFTvL8503-xAzZ1irolgBXseOwzE&usqp=CAU"
                                        alt="company7"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://upload.wikimedia.org/wikipedia/commons/f/f9/TMA-Solutions-Logo.png"
                                        alt="company8"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-fpt-inkythuatso-1-01-01-14-33-35.jpg"
                                        alt="company9"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/STi_logo.svg/1280px-STi_logo.svg.png"
                                        alt="company10"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://seeklogo.com/images/N/nab-logo-85681BB8AE-seeklogo.com.png"
                                        alt="company11"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0xPTEE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--e622a8382b21b032819f520d792bef976ace053e/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--15c3f2f3e11927673ae52b71712c1f66a7a1b7bd/TX_RGB_Primary_onWhite.png"
                                        alt="company12"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://png.pngtree.com/templates/20181023/technology-logo-template-png_37582.jpg"
                                        alt="company13"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://itviec.com/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBenZhT2c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--78256eff185961a6e10697371a0cdb77a0c699c9/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJY0c1bkJqb0dSVlE2RkhKbGMybDZaVjkwYjE5c2FXMXBkRnNIYVFJc0FXa0NMQUU9IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--15c3f2f3e11927673ae52b71712c1f66a7a1b7bd/Blue%20Illustrated%20Pool%20Party%20Instagram%20Post.png"
                                        alt="company14"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Absolute_Software_logo.svg/1280px-Absolute_Software_logo.svg.png"
                                        alt="company15"
                                    />
                                </div>
                                <div className="flex h-[160px] items-center justify-center rounded-lg bg-white shadow-xl">
                                    <img
                                        className=" w-[80px]"
                                        src="https://pbs.twimg.com/profile_images/1692450915247419392/PiRV6Pl__400x400.jpg"
                                        alt="company16"
                                    />
                                </div>
                            </div>
                        </Container>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HomeEmployer;
