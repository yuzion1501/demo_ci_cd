import React from "react";
import Container from "@/components/layout/container";

const VerifyEmployer = () => {
    return (
        <Container className="flex h-vh-main flex-col  pt-8">
            <div className="container-lg bg-white">
                <div className="flex flex-col items-center justify-center p-4">
                    <img
                        className="w-52"
                        src="https://itviec.com/assets/robby/robby-subscription-65907a5d2a274578c6f959a5458bc84281c07cc97831d62609a719dee7cab69f.svg"
                        alt="img"
                    />
                    <div className="text-center">
                        <h1 className="mb-4 mt-5 text-3xl font-extrabold">
                            Registration Successful!
                        </h1>
                        <div className="text-rich-grey paragraph mb-2 leading-7">
                            An administrator will review your information and
                            contact you via the phone number you provided.
                            <br />
                            You will also receive an email to verify your
                            account. Please wait patiently !
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default VerifyEmployer;
